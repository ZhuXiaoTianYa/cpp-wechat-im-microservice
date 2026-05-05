#include "mainwidget.h"
#include "ui_mainwidget.h"


MainWidget* MainWidget::instance=nullptr;


// 启用亚克力效果
void MainWidget::enableAcrylicBlur(HWND hwnd, DWORD gradientColor ) {
    // 设置亚克力参数：ARGB 格式，这里使用半透白色底 (0x99FFFFFF 可调整透明度)
    // GradientColor = AABBGGRR (注意字节序)，常用 0x32FFFFFF 浅色半透，0x99000000 深色半透
    ACCENTPOLICY policy = { ACCENT_ENABLE_ACRYLICBLURBEHIND, 0x3, gradientColor, 0 };
    WINCOMPATTRDATA data = { 19, &policy, sizeof(policy) }; // 19 = WCA_ACCENT_POLICY

    HMODULE hUser32 = GetModuleHandleW(L"user32.dll");
    if (hUser32) {
        auto pSetWindowCompositionAttribute = (BOOL(WINAPI*)(HWND, WINCOMPATTRDATA*))GetProcAddress(hUser32, "SetWindowCompositionAttribute");
        if (pSetWindowCompositionAttribute) {
            pSetWindowCompositionAttribute(hwnd, &data);
        }
    }
}

MainWidget::MainWidget(QWidget *parent)
    : QWidget(parent)
    , ui(new Ui::MainWidget)
{
    ui->setupUi(this);
    this->setWindowTitle("WeChat");


    this->setWindowFlags(Qt::FramelessWindowHint);

    // 1. 启用透明背景，使亚克力效果能显示出来
    //setAttribute(Qt::WA_TranslucentBackground);

    // 2. 启用窗口亚克力模糊（参数0x32FFFFFF = 50%白色半透，可自行调整）
    enableAcrylicBlur((HWND)winId(), 0x50DCDCE1);
    this->setStyleSheet("QWidget { background-color: rgba(250,250,252, 0); }");
    this->setWindowIcon(QIcon(":/resource/image/logo.png"));
    initMainWindow();
    initLeftWindow();
    initMidWindow();
    initRightWindow();
    initSignalSlot();
}

void MainWidget::loadSessionList()
{

}

void MainWidget::loadFriendList()
{

}

void MainWidget::loadApplyList()
{

}

void MainWidget::initSignalSlot()
{
    connect(sessionTabBtn,&QPushButton::clicked,this,&MainWidget::switchTabToSession);
    connect(friendTabBtn,&QPushButton::clicked,this,&MainWidget::switchTabToFriend);
    connect(applyTabBtn,&QPushButton::clicked,this,&MainWidget::switchTabToApply);
}

void MainWidget::switchTabToSession()
{
    activeTab=SESSION_LIST;
    sessionTabBtn->setIcon(QIcon(":/resource/image/session_active.png"));
    friendTabBtn->setIcon(QIcon(":/resource/image/friend_inactive.png"));
    applyTabBtn->setIcon(QIcon(":/resource/image/apply_inactive.png"));
    this->loadSessionList();
}

void MainWidget::switchTabToFriend()
{
    activeTab=SESSION_LIST;
    sessionTabBtn->setIcon(QIcon(":/resource/image/session_inactive.png"));
    friendTabBtn->setIcon(QIcon(":/resource/image/friend_active.png"));
    applyTabBtn->setIcon(QIcon(":/resource/image/apply_inactive.png"));
    this->loadFriendList();
}

void MainWidget::switchTabToApply()
{
    activeTab=SESSION_LIST;
    sessionTabBtn->setIcon(QIcon(":/resource/image/session_inactive.png"));
    friendTabBtn->setIcon(QIcon(":/resource/image/friend_inactive.png"));
    applyTabBtn->setIcon(QIcon(":/resource/image/apply_active.png"));
    this->loadApplyList();
}

MainWidget *MainWidget::getInstance()
{
    if(instance==nullptr)
    {
        instance=new MainWidget();
    }
    return instance;
}

MainWidget::~MainWidget()
{
    delete ui;
}

void MainWidget::initMainWindow()
{

    QVBoxLayout* mainLayout=new QVBoxLayout();
    mainLayout->setContentsMargins(0,0,0,0);
    mainLayout->setSpacing(0);
    this->setLayout(mainLayout);

    titleBar=new TitleBar(this);

    QHBoxLayout* layout=new QHBoxLayout();
    layout->setContentsMargins(0,0,0,0);
    layout->setSpacing(0);

    windowLeft=new QWidget();
    windowMid=new QWidget();
    windowRight=new QWidget();

    windowLeft->setFixedWidth(60);
    windowMid->setFixedWidth(240);
    windowRight->setMinimumWidth(360);

    windowLeft->setStyleSheet("QWidget { background-color: rgba(220,220,225,0); }");
    windowMid->setStyleSheet("QWidget { background-color: rgb(238,238,240); border-top-left-radius: 5px;}");
    windowRight->setStyleSheet("QWidget { background: rgb(250,250,250); }");

    layout->addWidget(windowLeft);
    layout->addWidget(windowMid);
    layout->addWidget(windowRight);

    mainLayout->addWidget(titleBar);
    mainLayout->addLayout(layout);

    connect(titleBar,&TitleBar::sigMin,this,&MainWidget::showMinimized);
    connect(titleBar,&TitleBar::sigClose,this,&MainWidget::close);
    connect(titleBar,&TitleBar::sigMax,this,[=](){
        if(this->isMaximized()==false)
        {
            this->showMaximized();
        }
        else
        {
            this->showNormal();
        }
    });

}

void MainWidget::initLeftWindow()
{
    QVBoxLayout* layout=new QVBoxLayout();
    layout->setSpacing(13);
    layout->setContentsMargins(0,15,0,0);
    windowLeft->setLayout(layout);

    userAvatar=new QPushButton();
    userAvatar->setFixedSize(36,36);
    userAvatar->setIconSize(QSize(34,34));
    userAvatar->setIcon(QIcon(":/resource/image/defaultAvatar.png"));
    userAvatar->setStyleSheet("QPushButton { background-color: transparent; border: none;}");
    layout->addWidget(userAvatar,1,Qt::AlignTop|Qt::AlignHCenter);

    sessionTabBtn=new QPushButton();
    sessionTabBtn->setFixedSize(38,38);
    sessionTabBtn->setIconSize(QSize(26,26));
    sessionTabBtn->setIcon(QIcon(":/resource/image/session_active.png"));
    sessionTabBtn->setStyleSheet("QPushButton { background-color: transparent; border: none;}");
    layout->addWidget(sessionTabBtn,1,Qt::AlignTop|Qt::AlignHCenter);

    friendTabBtn=new QPushButton();
    friendTabBtn->setFixedSize(38,38);
    friendTabBtn->setIconSize(QSize(26,26));
    friendTabBtn->setIcon(QIcon(":/resource/image/friend_inactive.png"));
    friendTabBtn->setStyleSheet("QPushButton { background-color: transparent; border: none;}");
    layout->addWidget(friendTabBtn,1,Qt::AlignTop|Qt::AlignHCenter);

    applyTabBtn=new QPushButton();
    applyTabBtn->setFixedSize(38,38);
    applyTabBtn->setIconSize(QSize(26,26));
    applyTabBtn->setIcon(QIcon(":/resource/image/apply_inactive.png"));
    applyTabBtn->setStyleSheet("QPushButton { background-color: transparent; border: none;}");
    layout->addWidget(applyTabBtn,1,Qt::AlignTop|Qt::AlignHCenter);

    layout->addStretch(45);
}

void MainWidget::initRightWindow()
{

}

void MainWidget::initMidWindow()
{
    QGridLayout* layout=new QGridLayout();
    layout->setContentsMargins(0,10,0,0);
    layout->setSpacing(0);
    windowMid->setLayout(layout);

    searchEdit=new QLineEdit();
    searchEdit->setFixedHeight(25);
    searchEdit->setPlaceholderText("搜索");
    searchEdit->setStyleSheet("QLineEdit { border-radius: 5px; background: rgb(250,250,250); padding-left: 5px;}");

    addFriendBtn=new QPushButton();
    addFriendBtn->setFixedSize(25,25);
    addFriendBtn->setIcon(QIcon(":/resource/image/cross.png"));
    QString style="QPushButton { border-radius: 5px; background-color: transparent; }";
    style+=" QPushButton:hover { background-color: rgb(209,209,211);}";
    addFriendBtn->setStyleSheet(style);

    SessionFriendArea* sessionFriendArea=new SessionFriendArea();

    QWidget* spacer_1=new QWidget();
    QWidget* spacer_2=new QWidget();
    QWidget* spacer_3=new QWidget();
    spacer_1->setFixedWidth(12);
    spacer_2->setFixedWidth(10);
    spacer_3->setFixedWidth(10);

    layout->addWidget(spacer_1,0,0,Qt::AlignTop);
    layout->addWidget(searchEdit,0,1,Qt::AlignTop);
    layout->addWidget(spacer_2,0,2,Qt::AlignTop);
    layout->addWidget(addFriendBtn,0,3,Qt::AlignTop);
    layout->addWidget(spacer_3,0,4,Qt::AlignTop);
    layout->addWidget(sessionFriendArea,1,0,1,5,Qt::AlignTop);
    layout->setRowStretch(1,1);

}