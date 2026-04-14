# 声明所需要的cmake版本
cmake_minimum_required(VERSION 3.0.0)
# 定义项目工程名称(但是不是说生成的可执行程序就一定要叫这个)
project(test)
# 设置生成目标(第一个是生成的程序名称，后面为所依赖的cpp文件)
add_executable(main main.cc)

set(target "main")
set(src_files "")
list(append src_file main.cc test.cc)

set(obj_file "")
string(REPLACE ".cc" ".o" obj_file ${src_file})

target_link_libraries(main -lspdlog -lfmt)

message(STATUS "普通提示")
message(FATAL_ERROR "致命错误--会导致cmake执行退出")

# 源码文件 .cc .c .cpp ...
set(src_file "")
aux_source_directory(src_dir src_file)