#include <json/json.h>
#include <iostream>
#include <sstream>
#include <string>
#include <memory>

bool Serialize(const Json::Value &value, std::string &dest)
{
    Json::StreamWriterBuilder swb;
    std::unique_ptr<Json::StreamWriter> sw(swb.newStreamWriter());
    std::stringstream ss;
    int ret = sw->write(value, &ss);
    if (ret != 0)
    {
        return false;
    }
    dest = ss.str();
    return true;
}

bool UnSerialize(const std::string &src, Json::Value &value)
{
    Json::CharReaderBuilder crb;
    std::unique_ptr<Json::CharReader> cr(crb.newCharReader());
    std::string err;
    bool ret = cr->parse(src.c_str(), src.c_str() + src.size(), &value, &err);
    if (ret == false)
    {
        std::cout << err << std::endl;
        return false;
    }
    return true;
}

int main()
{
    char name[] = "zhutian";
    float score[3] = {84.6, 84.5, 64.5};
    int age = 16;
    Json::Value stu;
    stu["姓名"] = name;
    stu["年龄"] = age;
    stu["成绩"].append(score[0]);
    stu["成绩"].append(score[1]);
    stu["成绩"].append(score[2]);
    std::string st;
    bool ret = Serialize(stu, st);
    if (ret == false)
    {
        return -1;
    }
    std::cout << st << std::endl;

    Json::Value vlu;
    ret = UnSerialize(st, vlu);
    if (ret == false)
    {
        return -1;
    }
    std::cout << "--------------" << std::endl;
    std::cout << vlu["姓名"].asString() << std::endl;
    std::cout << vlu["年龄"].asInt() << std::endl;
    for (int i = 0; i < vlu["成绩"].size(); i++)
        std::cout << vlu["成绩"][i].asFloat() << std::endl;
}