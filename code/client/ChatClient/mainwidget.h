#ifndef MAINWIDGET_H
#define MAINWIDGET_H

#include <QWidget>
#include <QPushButton>
#include <QHBoxLayout>
#include <QVBoxLayout>
#include <QSize>
#include <QLineEdit>
#include <windows.h>
#include <dwmapi.h>
#include "titlebar.h"
#include "sessionfriendarea.h"

#pragma comment(lib,"dwmapi.lib")

#ifndef DWMWA_MICA_EFFECT
#define DWMWA_MICA_EFFECT 1021
#endif

QT_BEGIN_NAMESPACE
namespace Ui {
class MainWidget;
}
QT_END_NAMESPACE

class MainWidget : public QWidget
{
    Q_OBJECT
private:
    static MainWidget* instance;
    explicit MainWidget(QWidget *parent = nullptr);
public:
    static MainWidget* getInstance();
    ~MainWidget() override;
private:
    enum ActiveTab{
        SESSION_LIST,
        FRIEND_LIST,
        APPLY_LIST
    };
private:
    void initMainWindow();
    void initLeftWindow();
    void initRightWindow();
    void initMidWindow();
    void initSignalSlot();
    void switchTabToSession();
    void switchTabToFriend();
    void switchTabToApply();

    void loadSessionList();
    void loadFriendList();
    void loadApplyList();
private:
    Ui::MainWidget *ui;

    QWidget* windowLeft;
    QWidget* windowMid;
    QWidget* windowRight;

    QPushButton* userAvatar;
    QPushButton* sessionTabBtn;
    QPushButton* friendTabBtn;
    QPushButton* applyTabBtn;

    TitleBar* titleBar;

    QLineEdit* searchEdit;
    QPushButton* addFriendBtn;
    // SessionFriendArea* sessionFriendArea;

    ActiveTab activeTab=SESSION_LIST;

private:

    enum ACCENT_STATE {
        ACCENT_DISABLED = 0,
        ACCENT_ENABLE_GRADIENT = 1,
        ACCENT_ENABLE_TRANSPARENTGRADIENT = 2,
        ACCENT_ENABLE_BLURBEHIND = 3,
        ACCENT_ENABLE_ACRYLICBLURBEHIND = 4,  // 亚克力模糊
        ACCENT_INVALID_STATE = 5
    };

    struct ACCENTPOLICY {
        ACCENT_STATE AccentState;
        DWORD AccentFlags;
        DWORD GradientColor;
        DWORD AnimationId;
    };

    struct WINCOMPATTRDATA {
        int Attribute;
        PVOID Data;
        ULONG DataSize;
    };
protected:

    void enableAcrylicBlur(HWND hwnd, DWORD gradientColor = 0x32FFFFFF);
};
#endif // MAINWIDGET_H