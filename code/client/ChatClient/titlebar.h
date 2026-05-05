#ifndef TITLEBAR_H
#define TITLEBAR_H

#include <QWidget>
#include <QPushButton>
#include <QHBoxLayout>
#include <QVBoxLayout>
#include <QSize>
#include <QPoint>
#include <QFrame>
#include "closebutton.h"

class TitleBar : public QFrame
{
    Q_OBJECT
public:
    explicit TitleBar(QWidget *parent = nullptr);

private:
    void mousePressEvent(QMouseEvent* event);
    void mouseMoveEvent(QMouseEvent* event);
    void mouseReleaseEvent(QMouseEvent* event);
    void mouseDoubleClickEvent(QMouseEvent* event);

private:

    QPushButton* minBtn;
    QPushButton* maxBtn;
    CloseButton* closeBtn;

    bool isDrag=false;
    QPoint startPos;
    bool isMaximized=false;
signals:
    void sigMin();
    void sigMax();
    void sigClose();
};

#endif // TITLEBAR_H
