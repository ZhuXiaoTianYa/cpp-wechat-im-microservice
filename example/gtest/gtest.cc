#include <iostream>
#include <gtest/gtest.h>

int add(int x, int y)
{
    return x + y;
}

TEST(测试名称, 加法用例名称)
{
    ASSERT_EQ(add(10, 20), 30);
    ASSERT_LT(add(20, 20), 50);
}

TEST(测试名称, 字符串用例名称)
{
    std::string str = "Hello";
    EXPECT_EQ(str, "hello");
    std::cout << "EXPECT失败后，测试" << std::endl;
    ASSERT_EQ(str, "hello");
    std::cout << "ASSERT失败后，测试" << std::endl;
}

int main(int argc, char *argv[])
{
    testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}