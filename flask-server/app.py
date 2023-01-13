import pythoncom
from flask import Flask, request, send_from_directory, jsonify, json
from flask_cors import CORS
import xlwings as xw
import os
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
							   unset_jwt_cookies, jwt_required, JWTManager

app = Flask(__name__, static_folder="../build", static_url_path="/")

app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=35)
jwt = JWTManager(app)

CORS(app)

# Project Root file directory.
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response

@app.route('/token', methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email != "adminperf" or password != "sobek": #ideally we compare the extracted login details with the data in database.
        return {"msg": "Wrong email or password"}, 401

    access_token = create_access_token(identity=email)
    response = {"access_token":access_token}
    return response

@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@app.route('/')
def index():#tells flask to serve the index.html static file when flask is running.
    return app.send_static_file('index.html')

# MCC API Route
@app.route("/mcc/<filename>", methods=['POST'], strict_slashes=False)
@jwt_required()
def mcc(filename):
    pythoncom.CoInitialize()  # IMPORTANT: apparently running app creates a thread and this falls uner a multithreading issue which needs to be looked into another time. This line fixes this issue
    # This line is required since we are using COM (windows 32 library) therefore CoInitialize has to be called in this thread instance. https://stackoverflow.com/questions/9286600/when-do-i-need-to-call-coinitialize-in-this-scenario
    # https://www.oreilly.com/library/view/python-programming-on/1565926218/ch03s02s03.html
    data = request.get_json()
    updateInputTable(filename, data['totalNumSessions'], data['totalTraffic'],
                              data['numSites'], data['numCplane'], data['numUplane'])
    returnData = getOutputTable(filename)
    
    pythoncom.CoUninitialize()
    return returnData

# Allows you to download Excel sheet, returns an Excel sheet

@app.route("/download/<filename>", methods=['GET'], strict_slashes=False)
@jwt_required()
def download(filename):
    return send_from_directory(ROOT_DIR, filename)

# Update the input table in Excel with the parameters received from React.
# each params are arrays of numbers length of 5 (for 5 years of data)

def getInputTable(filename):
    def cleanInputTable(inputTable):
        #clear all null values in input table to become empty string
        for i in range(len(inputTable["totalNumSessions"])):
            if inputTable["totalNumSessions"][i] == None:
                inputTable["totalNumSessions"][i] = ""
        for i in range(len(inputTable["totalTraffic"])):
            if inputTable["totalTraffic"][i] == None:
                inputTable["totalTraffic"][i] = ""
        for i in range(len(inputTable["numSites"])):
            if inputTable["numSites"][i] == None:
                inputTable["numSites"][i] = ""
        for i in range(len(inputTable["numCplane"])):
            if inputTable["numCplane"][i] == None:
                inputTable["numCplane"][i] = ""
        for i in range(len(inputTable["numUplane"])):
            if inputTable["numUplane"][i] == None:
                inputTable["numUplane"][i] = ""
        return inputTable
    
    with xw.App(visible=False) as app:
        book = app.books.open(filename)
        sheet = book.sheets['Input & Output']
        inputTable = {
            "totalNumSessions": sheet.range('C4:G4').value,
            "totalTraffic": sheet.range('C5:G5').value,
            "numSites": sheet.range('C7:G7').value,
            "numCplane": sheet.range('C11:G11').value,
            'numUplane': sheet.range('C12:G12').value
        }
        inputTable = cleanInputTable(inputTable)
        book.save()
        book.close()
    return inputTable

def updateInputTable(filename, totalNumSessions, totalTraffic, numSites, numCplane, numUplane):
    with xw.App(visible=False) as app:
        book = app.books.open(filename)
        sheet = book.sheets['Input & Output']
        sheet.range('C4').value = [totalNumSessions[0], totalNumSessions[1],
                                   totalNumSessions[2], totalNumSessions[3], totalNumSessions[4]]
        sheet.range('C5').value = [totalTraffic[0], totalTraffic[1],
                                   totalTraffic[2], totalTraffic[3], totalTraffic[4]]
        sheet.range('C7').value = [numSites[0], numSites[1],
                                   numSites[2], numSites[3], numSites[4]]
        sheet.range('C11').value = [
            numCplane[0], numCplane[1], numCplane[2], numCplane[3], numCplane[4]]
        sheet.range('C12').value = [
            numUplane[0], numUplane[1], numUplane[2], numUplane[3], numUplane[4]]
        book.save()
        book.close()

def getOutputTable(filename):
    with xw.App(visible=False) as app:
    
        book = app.books.open(filename)
        sheet = book.sheets["Input & Output"]

        # Integrated Case
        totalNumSessionsIC = sheet.range('C20:G20').value
        totalTrafficIC = sheet.range('C21:G21').value
        numSitesIC = sheet.range('C22:G22').value
        sessionsPerSiteIC = sheet.range('C23:G23').value
        throughputPerSiteIC = sheet.range('C24:G24').value

        numCPMIC = sheet.range('C27:G27').value
        numISMIC = sheet.range('C28:G28').value
        numMCMIC = sheet.range('C29:G29').value

        numCPMTotalIC = sheet.range('C31:G31').value
        numISMTotalIC = sheet.range('C32:G32').value
        numMCMTotalIC = sheet.range('C33:G33').value

        numvCPUCPMIC = sheet.range('J27:N27').value
        numvCPUISMIC = sheet.range('J28:N28').value
        numvCPUMCMIC = sheet.range('J29:N29').value

        numvCPUCPMTotalIC = sheet.range('J31:N31').value
        numISMvCPUTotalIC = sheet.range('J32:N32').value
        numMCMvCPUTotalIC = sheet.range('J33:N33').value

        totalNumSessionsCCCP = sheet.range('C38:G38').value
        totalTrafficCCCP = sheet.range('C39:G39').value

        numCPMCCCP = sheet.range('C41:G41').value
        numSSMCCCP = sheet.range('C42:G42').value
        numMCMCCCP = sheet.range('C43:G43').value

        numCPMTotalCCCP = sheet.range('C45:G45').value
        numSSMTotalCCCP = sheet.range('C46:G46').value
        numMCMTotalCCCP = sheet.range('C47:G47').value

        numCPMvCPUCCCP = sheet.range('J41:N41').value
        numSSMvCPUCCCP = sheet.range('J42:N42').value
        numMCMvCPUCCCP = sheet.range('J43:N43').value

        numCPMvCPUTotalCCCP = sheet.range('J45:N45').value
        numSSMvCPUTotalCCCP = sheet.range('J46:N46').value
        numMCMvCPUTotalCCCP = sheet.range('J47:N47').value

        totalNumSessionsCCUP = sheet.range('C50:G50').value
        totalTrafficCCUP = sheet.range('C51:G51').value

        numCPMCCUP = sheet.range('C53:G53').value
        numISMCCUP = sheet.range('C54:G54').value
        numMCMCCUP = sheet.range('C55:G55').value

        numCPMTotalCCUP = sheet.range('C57:G57').value
        numISMTotalCCUP = sheet.range('C58:G58').value
        numMCMTotalCCUP = sheet.range('C59:G59').value

        numCPMvCPUCCUP = sheet.range('J53:N53').value
        numISMvCPUCCUP = sheet.range('J54:N54').value
        numMSMvCPUCCUP = sheet.range('J55:N55').value

        numCPMvCPUTotalCCUP = sheet.range('J57:N57').value
        numISMvCPUTotalCCUP = sheet.range('J58:N58').value
        numMSMvCPUTotalCCUP = sheet.range('J59:N59').value
        book.save()
        book.close()
    return {
        'totalNumSessionsIC': totalNumSessionsIC,
        'totalTrafficIC': totalTrafficIC,
        'numSitesIC': numSitesIC,
        'sessionsPerSiteIC': sessionsPerSiteIC,
        'throughputPerSiteIC': throughputPerSiteIC,
        'numCPMIC': numCPMIC,
        'numISMIC': numISMIC,
        'numMCMIC': numMCMIC,
        'numCPMTotalIC': numCPMTotalIC,
        'numISMTotalIC': numISMTotalIC,
        'numMCMTotalIC': numMCMTotalIC,
        'numvCPUCPMIC': numvCPUCPMIC,
        'numvCPUISMIC': numvCPUISMIC,
        'numvCPUMCMIC': numvCPUMCMIC,
        'numvCPUCPMTotalIC': numvCPUCPMTotalIC,
        'numISMvCPUTotalIC': numISMvCPUTotalIC,
        'numMCMvCPUTotalIC': numMCMvCPUTotalIC,
        'totalNumSessionsCCCP': totalNumSessionsCCCP,
        'totalTrafficCCCP': totalTrafficCCCP,
        'numCPMCCCP': numCPMCCCP,
        'numSSMCCCP': numSSMCCCP,
        'numMCMCCCP': numMCMCCCP,
        'numCPMTotalCCCP': numCPMTotalCCCP,
        'numSSMTotalCCCP': numSSMTotalCCCP,
        'numMCMTotalCCCP': numMCMTotalCCCP,
        'numCPMvCPUCCCP': numCPMvCPUCCCP,
        'numSSMvCPUCCCP': numSSMvCPUCCCP,
        'numMCMvCPUCCCP': numMCMvCPUCCCP,
        'numCPMvCPUTotalCCCP': numCPMvCPUTotalCCCP,
        'numSSMvCPUTotalCCCP': numSSMvCPUTotalCCCP,
        'numMCMvCPUTotalCCCP': numMCMvCPUTotalCCCP,
        'totalNumSessionsCCUP': totalNumSessionsCCUP,
        'totalTrafficCCUP': totalTrafficCCUP,
        'numCPMCCUP': numCPMCCUP,
        'numISMCCUP': numISMCCUP,
        'numMCMCCUP': numMCMCCUP,
        'numCPMTotalCCUP': numCPMTotalCCUP,
        'numISMTotalCCUP': numISMTotalCCUP,
        'numMCMTotalCCUP': numMCMTotalCCUP,
        'numCPMvCPUCCUP': numCPMvCPUCCUP,
        'numISMvCPUCCUP': numISMvCPUCCUP,
        'numMSMvCPUCCUP': numMSMvCPUCCUP,
        'numCPMvCPUTotalCCUP': numCPMvCPUTotalCCUP,
        'numISMvCPUTotalCCUP': numISMvCPUTotalCCUP,
        'numMSMvCPUTotalCCUP': numMSMvCPUTotalCCUP,
    }

def updateControlSummarySheet(filename, data):
    with xw.App(visible=False) as app:
        book = app.books.open(filename)
        sheet = book.sheets['Control & Summary']
        # returns a range object consisting address of parameter table.
        parameterTable = sheet['F21'].expand()
        
        # grab the next available column in parameter table and send to frontend
        startingColumn = parameterTable.column + 1
        startingRow = parameterTable.row
        # Master Control settings
        sheet.range('C4').value = data["masterControl"][0]["data"]
        sheet.range(
            'SSM_ISM__Number_of_vCPU_s').value = data["masterControl"][1]["data"]
        sheet.range(
            'CPM_DCM_CCM__Number_of_vCPU_s').value = data["masterControl"][2]["data"]
        sheet.range(
            'MCM__Number_of_vCPU_s').value = data["masterControl"][3]["data"]
        sheet.range(
            'SSM_ISM__Memory__GB').value = data["masterControl"][4]["data"]
        sheet.range('CPM__Memory__GB').value = data["masterControl"][5]["data"]
        sheet.range('MCM__Memory__GB').value = data["masterControl"][6]["data"]
        sheet.range(
            'Max_session_per_ISM').value = data["masterControl"][7]["data"]
        sheet.range(
            'Max_session_per_CPM').value = data["masterControl"][8]["data"]
        sheet.range(
            'Control_Plane_CPU_engineering_limit').value = data["masterControl"][9]["data"]
        sheet.range(
            'User_Plane_CPU_engineering_limit').value = data["masterControl"][10]["data"]
        sheet.range(
            'Control_Plane_Memory_engineering_limit').value = data["masterControl"][11]["data"]
        sheet.range(
            'User_Plane_Memory_engineering_limit').value = data["masterControl"][12]["data"]
        sheet.range(
            'Max_number_of_CPMs_in_a_cluster').value = data["masterControl"][13]["data"]
        sheet.range(
            'Max_number_of_ISMs_in_a_cluster').value = data["masterControl"][14]["data"]
        
        # UP Cluster Related Parameters
        sheet.range(
            'User_Plane_Cluster_Related_Parameters').value = data["UPClusterRelatedParams"][0]["data"]
        response = "Data post to control & summary successful"
                
        #editable parameters begin on the 5th index in data["defaultCustomizedParams][i]["data"]
        for row in range(len(data["defaultCustomizedParams"])):
            for col in range(4, len(data["defaultCustomizedParams"][row]["data"])):
                sheet.range((startingRow + row, startingColumn + col)).value = data["defaultCustomizedParams"][row]["data"][col]
        book.save()
        book.close()
    return response

@app.route("/control/<filename>", methods=['GET', 'POST'], strict_slashes=False)
@jwt_required()
def ControlSummarySheet(filename):
    pythoncom.CoInitialize()
    response = []
    # TODO: USE sheet['variableName'].expand().value for table in future iterations
    if request.method == 'GET':
        response = getControlSummarySheet(filename)
    elif request.method == 'POST':
        data = request.get_json()
        response = updateControlSummarySheet(filename, data)
    pythoncom.CoUninitialize()
    return response

def getControlSummarySheet(filename):
    with xw.App(visible=False) as app:
        book = app.books.open(filename)
        sheet = book.sheets['Control & Summary']
        parameterTable = sheet['F21'].expand()
        startingColumn = parameterTable.column + 1
        startingRow = parameterTable.row
        lastColumn = parameterTable.end('right').column
        response = {
                "masterControl": [
                    {
                        'name': "Gateway Type",
                        'id': "gatewayType",
                        'data': sheet.range('C4').value,
                    },
                    {
                        'name': "SSM/ISM: Number of vCPU's",
                        'id': "numSSMvCPU",
                        'data': sheet.range('SSM_ISM__Number_of_vCPU_s').value,
                    },
                    {
                        'name': "CPM/DCM/CCM: Number of vCPU's",
                        'id': "numCPMvCPU",
                        'data': sheet.range('CPM_DCM_CCM__Number_of_vCPU_s').value,
                    },
                    {
                        'name': "MCM: Number of vCPU's",
                        'id': "numMCMvCPU",
                        'data': sheet.range('MCM__Number_of_vCPU_s').value,
                    },
                    {
                        'name': "SSM/ISM: Memory (GB)",
                        'id': "memorySSM",
                        'data': sheet.range('SSM_ISM__Memory__GB').value,
                    },
                    {
                        'name': "CPM: Memory (GB)",
                        'id': "memoryCPM",
                        'data': sheet.range('CPM__Memory__GB').value,
                    },
                    {
                        'name': "MCM: Memory (GB)",
                        'id': "memoryMCM",
                        'data': sheet.range('MCM__Memory__GB').value,
                    },
                    {
                        'name': "Max session per ISM",
                        'id': "maxSessionPerISM",
                        'data': sheet.range('Max_session_per_ISM').value,
                    },
                    {
                        'name': "Max session per CPM",
                        'id': "maxSessionPerCPM",
                        'data': sheet.range('Max_session_per_CPM').value,
                    },
                    {
                        'name': "Control Plane CPU engineering limit",
                        'id': "controlPlaneCPULimit",
                        'data': sheet.range('Control_Plane_CPU_engineering_limit').value,
                    },
                    {
                        'name': "User Plane CPU engineering limit",
                        'id': "userPlaneCPULimit",
                        'data': sheet.range('User_Plane_CPU_engineering_limit').value,
                    },
                    {
                        'name': "Control Plane Memory engineering limit",
                        'id': "controlPlaneMemoryLimit",
                        'data': sheet.range('Control_Plane_Memory_engineering_limit').value,
                    },
                    {
                        'name': "User Plane Memory engineering limit",
                        'id': "userPlaneMemoryLimit",
                        'data': sheet.range('User_Plane_Memory_engineering_limit').value,
                    },
                    {
                        'name': "Max number of CPMs in a cluster",
                        'id': "maxNumCPMsCluster",
                        'data': sheet.range('Max_number_of_CPMs_in_a_cluster').value,
                    },
                    {
                        'name': "Max number of ISMs in a cluster",
                        'id': "maxNUmISMsCluster",
                        'data': sheet.range('Max_number_of_ISMs_in_a_cluster').value,
                    },
                ],
                "UPClusterRelatedParams": [
                    {
                        'name': "User Plane Cluster Related Parameters",
                        'id': "UPParams",
                        'data': sheet.range('User_Plane_Cluster_Related_Parameters').value,
                        'parameters': [sheet.range('G21').value, sheet.range('H21').value, sheet.range('I21').value, sheet.range('J21').value, sheet.range('K21').value, sheet.range('L21').value]
                    },
                    {
                        'name': "Packet Switching Technollogy (SRIOV/NVDS/vSwitch)",
                        'id': "PacketSwitchingTechnology",
                        'data': sheet.range('Pkt_Switching_Technology__SRIOV_NVDS_vSwitch').value,
                    },
                    {
                        'name': "TAM Enabled",
                        'id': "TAMEnabled",
                        'data': sheet.range('TAM_Enabled').value,
                    },
                    {
                        'name': "Is MultiQ Enabled? (1=YES; 0=NO)",
                        'id': "MultiQEnabled",
                        'data': sheet.range('Is_MultiQ_Enabled?__1_YES__0_NO').value,
                    },
                    {
                        'name': "Average Packet Size (Bytes)",
                        'id': "AvgPacketSize",
                        'data': sheet.range('Average_Packet_Size__Bytes').value,
                    },
                    {
                        'name': "Legal Intercept enabled? (%)",
                        'id': "LegalInterceptEnabled",
                        'data': sheet.range('Legal_Intercept_enabled?').value,
                    },
                    {
                        'name': "EDR enabled? (1=YES; 0=NO)",
                        'id': "EDREnabled",
                        'data': sheet.range('EDR_enabled?__1_YES__0_NO').value,
                    },
                    {
                        'name': "CGNAT enabled? (1=YES; 0=NO)",
                        'id': "CGNATEnabled",
                        'data': sheet.range('CGNAT_enabled?__1_YES__0_NO').value,
                    },
                    {
                        'name': "Percentage of traffic going through proxy",
                        'id': "PercentageTrafficProxy",
                        'data': sheet.range('Percentage_of_traffic_going_through_proxy').value,
                    },
                    {
                        'name': "L7 DPI % & App hueristic analysis",
                        'id': "L7DPIAppAnalysis",
                        'data': sheet.range('L7_DPI_____App_hueristic_analysis').value,
                    },
                    {
                        'name': "IO bandwidth per NUMA (after redundancy) Gbps",
                        'id': "IOBandwidthNUMA",
                        'data': sheet.range('IO_bandwidth_per_NUMA__after_redundancy__Gbps').value,
                    },
                    {
                        'name': "CP - Avg # of Transactions Per BH per Session",
                        'id': "CPAvgTransactions",
                        'data': sheet.range('CP___Avg___of_Transactions_Per_BH_per_Session').value,
                    },
                    {
                        'name': "UP - CPM session memory (kB)",
                        'id': "UPCPMSessionMemory",
                        'data': sheet.range('UP___CPM_session_memory__kB').value,
                    },
                    {
                        'name': "UP - SSM session memory (kB)",
                        'id': "UPSSMSessionMemory",
                        'data': sheet.range('UP___SSM_session_memory__kB').value,
                    },
                    {
                        'name': "UP - CPM OS memory usage (GB)",
                        'id': "UPCPMOSMemory",
                        'data': sheet.range('UP___CPM_OS_memory_usage__GB').value,
                    },
                    {
                        'name': "UP - SSM OS memory usage (GB)",
                        'id': "UPSSMOSMemory",
                        'data': sheet.range('UP___SSM_OS_memory_usage__GB').value,
                    },
                    {
                        'name': "CP - CPM session memory (kB)",
                        'id': "CPCPMSessionMemory",
                        'data': sheet.range('CP___CPM_session_memory__kB').value,
                    },
                    {
                        'name': "CP - SSM session memory (kB)",
                        'id': "CPSSMSessionMemory",
                        'data': sheet.range('CP___SSM_session_memory__kB').value,
                    },
                    {
                        'name': "CP - CPM OS memory usage (GB)",
                        'id': "CPCPMOSMemory",
                        'data': sheet.range('CP___CPM_OS_memory_usage__GB').value,
                    },
                    {
                        'name': "CP - SSM OS memory usage (GB)",
                        'id': "CPSSMOSMemory",
                        'data': sheet.range('CP___SSM_OS_memory_usage__GB').value,
                    },
                    {
                        'name': "Integrated - CPM session memory (kB)",
                        'id': "IntegratedCPMSessionMemory",
                        'data': sheet.range('Integrated___CPM_session_memory__kB').value,
                    },
                    {
                        'name': "Integrated - SSM session memory (kB))",
                        'id': "IntegratedSSMSessionMemory",
                        'data': sheet.range('Integrated___SSM_session_memory__kB').value,
                    },
                    {
                        'name': "Integrated - CPM OS memory usage (GB)",
                        'id': "IntegratedCPMOSMemory",
                        'data': sheet.range('Integrated___CPM_OS_memory_usage__GB').value,
                    },
                    {
                        'name': "Integrated - SSM OS memory usage (GB)",
                        'id': "IntegratedSSMOSMemory",
                        'data': sheet.range('Integrated___SSM_OS_memory_usage__GB').value,
                    },
                ],
                "defaultCustomizedParams": [
                    {
                        'name': "Parameters",
                        'id': "UPParams",
                        'data': sheet.range((startingRow, startingColumn), (startingRow, lastColumn)).value
                    },
                    {
                        'name': "Packet Switching Technology (SRIOV/NVDS/vSwitch)",
                        'id': "PacketSwitchingTechnology",
                        'data': sheet.range((startingRow + 1, startingColumn), (startingRow + 1, lastColumn)).value,
                    },
                    {
                        'name': "TAM Enabled",
                        'id': "TAMEnabled",
                        'data': sheet.range((startingRow + 2, startingColumn), (startingRow + 2, lastColumn)).value,

                    }, {
                        'name': "is MultiQ Enabled? (1=Yes; 0=NO)",
                        'id': "MultiQEnabled",
                        'data': sheet.range((startingRow + 3, startingColumn), (startingRow + 3, lastColumn)).value,

                    }, {
                        'name': "Average Packet Size (Bytes)",
                        'id': "AvgPacketSize",
                        'data': sheet.range((startingRow + 4, startingColumn), (startingRow + 4, lastColumn)).value,

                    }, {
                        'name': "Legal Intercept enabled? (%)",
                        'id': "LegalInterceptEnabled",
                        'data': sheet.range((startingRow + 5, startingColumn), (startingRow + 5, lastColumn)).value,

                    }, {
                        'name': "EDR enabled? (1=YES; 0=NO)",
                        'id': "EDREnabled",
                        'data': sheet.range((startingRow + 6, startingColumn), (startingRow + 6, lastColumn)).value,
                    }, {
                        'name': "CGNAT enabled? (1=YES; 0=NO)",
                        'id': "CGNATEnabled",
                        'data': sheet.range((startingRow + 7, startingColumn), (startingRow + 7, lastColumn)).value,
                    }, {
                        'name': "Percentage of traffic going through proxy",
                        'id': "PercentageTrafficProxy",
                        'data': sheet.range((startingRow + 8, startingColumn), (startingRow + 8, lastColumn)).value,
                    }, {
                        'name': "L7 DPI % & App hueristic analysis",
                        'id': "L7DPIAppAnalysis",
                        'data': sheet.range((startingRow + 9, startingColumn), (startingRow + 9, lastColumn)).value,
                    }, {
                        'name': "IO bandwidth per NUMA (after redundancy) Gbps",
                        'id': "IOBandwidthNUMA",
                        'data': sheet.range((startingRow + 10, startingColumn), (startingRow + 10, lastColumn)).value,
                    }, {
                        'name': "CP - Avg # of Transactions Per BH per Session",
                        'id': "CPAvgTransactions",
                        'data': sheet.range((startingRow + 11, startingColumn), (startingRow + 11, lastColumn)).value,
                    },
                    {
                        'name': "UP - CPM session memory (kB)",
                        'id': "UPCPMSessionMemory",
                        'data': sheet.range((startingRow + 12, startingColumn), (startingRow + 12, lastColumn)).value,

                    },
                    {
                        'name': "UP - SSM session memory (kB)",
                        'id': "UPSSMSessionMemory",
                        'data': sheet.range((startingRow + 13, startingColumn), (startingRow + 13, lastColumn)).value,
                    },
                    {
                        'name': "UP - CPM OS memory usage (GB)",
                        'id': "UPCPMOSMemory",
                        'data': sheet.range((startingRow + 14, startingColumn), (startingRow + 14, lastColumn)).value,
                    },
                    {
                        'name': "UP - SSM OS memory usage (GB)",
                        'id': "UPSSMOSMemory",
                        'data': sheet.range((startingRow + 15, startingColumn), (startingRow + 15, lastColumn)).value,
                    },
                    {
                        'name': "CP - CPM session memory (kB)",
                        'id': "CPCPMSessionMemory",
                        'data': sheet.range((startingRow + 16, startingColumn), (startingRow + 16, lastColumn)).value,
                    },
                    {
                        'name': "CP - SSM session memory (kB)",
                        'id': "CPSSMSessionMemory",
                        'data': sheet.range((startingRow + 17, startingColumn), (startingRow + 17, lastColumn)).value,
                    },
                    {
                        'name': "CP - CPM OS memory usage (GB)",
                        'id': "CPCPMOSMemory",
                        'data': sheet.range((startingRow + 18, startingColumn), (startingRow + 18, lastColumn)).value,
                    },
                    {
                        'name': "CP - SSM OS memory usage (GB)",
                        'id': "CPSSMOSMemory",
                        'data': sheet.range((startingRow + 19, startingColumn), (startingRow + 19, lastColumn)).value,
                    },
                    {
                        'name': "Integrated - CPM session memory (kB)",
                        'id': "IntegratedCPMSessionMemory",
                        'data': sheet.range((startingRow + 20, startingColumn), (startingRow + 20, lastColumn)).value,
                    },
                    {
                        'name': "Integrated - SSM session memory (kB))",
                        'id': "IntegratedSSMSessionMemory",
                        'data': sheet.range((startingRow + 21, startingColumn), (startingRow + 21, lastColumn)).value,
                    },
                    {
                        'name': "Integrated - CPM OS memory usage (GB)",
                        'id': "IntegratedCPMOSMemory",
                        'data': sheet.range((startingRow + 22, startingColumn), (startingRow + 22, lastColumn)).value,
                    },
                    {
                        'name': "Integrated - SSM OS memory usage (GB)",
                        'id': "IntegratedSSMOSMemory",
                        'data': sheet.range((startingRow + 23, startingColumn), (startingRow + 23, lastColumn)).value,
                    },
                ]
            }
        book.save()
        book.close()
    return response

# Create new Excel file based on username, description, ticket and the universal sizing model we have.
@app.route("/createbook", methods=["GET"], strict_slashes=False)
@jwt_required()
def createBook():
    pythoncom.CoInitialize()
    with xw.App(visible=False) as app:
        book = app.books.open("MCC Sizing Model v1.4.xlsx")
        now = datetime.now()
        newTitle = now.strftime("%Y_%m_%d_%H_%M_%S") + '.xlsx'
        book.save(newTitle)
        book.close()
    pythoncom.CoUninitialize()
    return newTitle

@app.route("/renamebook", methods=["POST"], strict_slashes=False)
@jwt_required()
def renameBook():
    data = request.get_json()
    if os.path.isfile(data["newFileName"]):
        print("The file already exists")
        return 'error file already exists'
    else:
        # Rename the file
        os.rename(data["currentFileName"], data["newFileName"])
    return data["newFileName"]

@app.route("/import", methods=["POST"], strict_slashes=False)
@jwt_required()
def importSizingModel():#create new session from imported input table, config table.
    data = request.get_json()
    #create new session with parameter filename
    filename = data['fileName']
    pythoncom.CoInitialize()
    with xw.App(visible=False) as app:
        if (os.path.exists(filename)):
            print('filename exists, opening the saved session.')
        else:
            book = app.books.open("MCC Sizing Model v1.4.xlsx")
            book.save(filename)
            book.close()
    
    inputTable = data['inputTable']
    configTable = data['configTable']
    updateInputTable(filename, inputTable['Total number of sessions'], inputTable['Total traffic (Gbps)'], inputTable['Number of sites (For Integrated MCC)'], inputTable['Number of C-plane sites'], inputTable['Number of U-plane sites'])
    updateControlSummarySheet(filename, configTable)
    inputTable = getInputTable(filename)
    pythoncom.CoUninitialize()
    return {
        "inputTable": inputTable,
        "configTable": configTable
    }


if __name__ == "__main__":
    app.run(debug=True, use_debugger=False)
