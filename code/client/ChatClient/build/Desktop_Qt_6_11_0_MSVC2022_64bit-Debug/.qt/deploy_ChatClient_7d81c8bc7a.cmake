include("D:/Repositories/gitee/cpp-feishu-im-microservice/code/client/ChatClient/build/Desktop_Qt_6_11_0_MSVC2022_64bit-Debug/.qt/QtDeploySupport.cmake")
include("${CMAKE_CURRENT_LIST_DIR}/ChatClient-plugins.cmake" OPTIONAL)
set(__QT_DEPLOY_I18N_CATALOGS "qtbase")

qt6_deploy_runtime_dependencies(
    EXECUTABLE "D:/Repositories/gitee/cpp-feishu-im-microservice/code/client/ChatClient/build/Desktop_Qt_6_11_0_MSVC2022_64bit-Debug/ChatClient.exe"
    GENERATE_QT_CONF
)
