#include "titlebar.h"
#include <QDebug>
#include <QEvent>
#include <QMouseEvent>
TitleBar::TitleBar(QWidget *parent)
    : QFrame{parent}
{

    //this->setAttribute(Qt::WA_TranslucentBackground);
    this->setFixedHeight(32);
    this->setStyleSheet("QFrame { background-color: rgba(220,220,225,0); }");
    QHBoxLayout* title_layout=new QHBoxLayout(this);
    title_layout->setContentsMargins(0,0,0,0);
    title_layout->setSpacing(0);
    this->setLayout(title_layout);

    minBtn=new QPushButton(this);
    maxBtn=new QPushButton(this);
    closeBtn=new CloseButton(this);

    minBtn->setFixedSize(30,32);
    minBtn->setIconSize(QSize(11,11));
    minBtn->setIcon(QIcon(":/resource/image/min.png"));
    QString minStyle="QPushButton { background-color: transparent; border: none;}";
    minStyle+="QPushButton:hover { background-color: rgb(216,216,221); border: none;}";
    minBtn->setStyleSheet(minStyle);

    maxBtn->setFixedSize(30,32);
    maxBtn->setIconSize(QSize(11,11));
    maxBtn->setIcon(QIcon(":/resource/image/max.png"));
    QString maxStyle="QPushButton { background-color: transparent; border: none;}";
    maxStyle+="QPushButton:hover { background-color: rgb(216,216,221); border: none;}";
    maxBtn->setStyleSheet(maxStyle);

    closeBtn->setFixedSize(30,32);
    closeBtn->setIconSize(QSize(11,11));
    closeBtn->setIcon(QIcon(":/resource/image/close_inactive.png"));
    QString closeStyle="QPushButton { background-color: transparent; border: none;}";
    closeStyle+="QPushButton:hover { background-color: rgb(237,76,76); border: none;}";
    closeBtn->setStyleSheet(closeStyle);

    title_layout->addStretch();
    title_layout->addWidget(minBtn);
    title_layout->addWidget(maxBtn);
    title_layout->addWidget(closeBtn);

    connect(minBtn,&QPushButton::clicked,this,&TitleBar::sigMin);
    connect(maxBtn,&QPushButton::clicked,this,&TitleBar::sigMax);
    connect(closeBtn,&QPushButton::clicked,this,&TitleBar::sigClose);

}

void TitleBar::mousePressEvent(QMouseEvent *event)
{
    qDebug()<<"11111";
    if(event->button()==Qt::LeftButton)
    {
        isDrag=true;
        startPos=event->globalPosition().toPoint()-this->parentWidget()->frameGeometry().topLeft();
    }
}

void TitleBar::mouseMoveEvent(QMouseEvent *event)
{
    if(isDrag==true)
    {
        this->parentWidget()->move(event->globalPosition().toPoint()-startPos);
    }
}

void TitleBar::mouseReleaseEvent(QMouseEvent *event)
{
    isDrag=false;
}

void TitleBar::mouseDoubleClickEvent(QMouseEvent *event)
{
    emit sigMax();
}


