#include "sessionfriendarea.h"

SessionFriendArea::SessionFriendArea(QWidget *parent)
    : QScrollArea{parent}
{

    this->setWidgetResizable(true);
    this->verticalScrollBar()->setStyleSheet("QScrollBar:vertical { width: 10px; background-color: rgba(166,166,168,0.8); }");
    this->horizontalScrollBar()->setStyleSheet("QScrollBar:horizontal { width: 0px; }");

    container =new QWidget();
    container->setFixedWidth(240);
    this->setWidget(container);

    QVBoxLayout *layout=new QVBoxLayout();
    layout->setAlignment(Qt::AlignTop);
    layout->setContentsMargins(0,13,0,0);
    layout->setSpacing(0);
    container->setLayout(layout);
    layout->addStretch();

    for(int i=0;i<500;i++)
    {
        QPushButton* btn=new QPushButton();
        btn->setText("按钮");
        layout->addWidget(btn,Qt::AlignTop);
    }

}
