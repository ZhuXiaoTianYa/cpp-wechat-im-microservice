#ifndef CLOSEBUTTON_H
#define CLOSEBUTTON_H

#include <QPushButton>
#include <QWidget>
#include <QEvent>
#include <QMouseEvent>
class CloseButton : public QPushButton
{
    Q_OBJECT
public:
    CloseButton(QWidget* parent);
private:
    void leaveEvent(QEvent* event);
    void enterEvent(QEnterEvent* event);
};

#endif // CLOSEBUTTON_H
