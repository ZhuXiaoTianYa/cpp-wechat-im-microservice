#include <fstream>
#include <random>
#include <string>
#include <sstream>
#include <atomic>
#include <iomanip>
#include "logger.hpp"

namespace im_server
{
    std::string uuid()
    {
        std::random_device rd;
        std::mt19937 generator(rd());
        std::uniform_int_distribution<int> distribution(0, 255);
        std::stringstream ss;
        for (int i = 0; i < 6; i++)
        {
            if (i == 2)
                ss << "-";
            ss << std::setw(2) << std::setfill('0') << std::hex << distribution(generator);
        }
        ss << "-";
        static std::atomic<int> idx(0);
        short tmp = idx.fetch_add(1);
        ss << std::setw(4) << std::setfill('0') << std::hex << tmp;
        return ss.str();
    }

    std::string vcode()
    {
        std::random_device rd;
        std::mt19937 generator(rd());
        std::uniform_int_distribution<int> distribution(0, 9);
        std::stringstream ss;
        for (int i = 0; i < 6; i++)
        {
            ss << distribution(generator);
        }
        return ss.str();
    }

    bool readFile(const std::string &filename, std::string &body)
    {
        std::ifstream ifs(filename, std::ios::binary);
        if (ifs.is_open() == false)
        {
            LOG_ERROR("打开文件{}失败", filename);
            return false;
        }
        ifs.seekg(0, std::ios::end);
        size_t flen = ifs.tellg();
        ifs.seekg(0, std::ios::beg);
        body.resize(flen);
        ifs.read(&body[0], flen);
        if (ifs.good() == false)
        {
            LOG_ERROR("读取文件{}数据失败", filename);
            ifs.close();
            return false;
        }
        ifs.close();
        return true;
    }

    bool writeFile(const std::string &filename, const std::string &body)
    {
        std::ofstream ofs(filename, std::ios::binary | std::ios::trunc);
        if (ofs.is_open() == false)
        {
            LOG_ERROR("打开文件{}失败", filename);
            return false;
        }
        ofs.write(body.c_str(), body.size());
        if (ofs.good() == false)
        {
            LOG_ERROR("写入文件{}数据失败", filename);
            ofs.close();
            return false;
        }
        ofs.close();
        return true;
    }
}
