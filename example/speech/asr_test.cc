#include "../common/asr.hpp"
#include <gflags/gflags.h>

DEFINE_bool(run_mode, false, "程序运行模式: false-调试 true-发布");
DEFINE_string(log_file, "", "发布模式下，指定日志输出文件");
DEFINE_uint32(log_level, 0, "发布模式下，指定日志输出等级");

DEFINE_string(app_id, "123456", "云服务的APP ID");
DEFINE_string(api_key, "123456", "云服务的API KEY");
DEFINE_string(secret_key, "123456", "云服务的SECRET KEY");

int main(int argc, char *argv[])
{
    gflags::ParseCommandLineFlags(&argc, &argv, true);
    init_logger(FLAGS_run_mode, FLAGS_log_file, FLAGS_log_level);
    ASRClient client(FLAGS_app_id, FLAGS_api_key, FLAGS_secret_key);
    std::string file_content;
    aip::get_file_content("16k.pcm", &file_content);
    std::string ret = client.recognize(file_content);
    if (ret.empty())
    {
        return -1;
    }
    std::cout << ret << std::endl;
    return 0;
}