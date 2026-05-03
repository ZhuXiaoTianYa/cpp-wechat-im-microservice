#include "mainwidget.h"

#include <QApplication>
#include "model/data.h"

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    MainWidget w;
    LOG()<<"hello";
    w.show();
    return QCoreApplication::exec();
}
