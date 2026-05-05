#include "closebutton.h"

CloseButton::CloseButton(QWidget* parent):QPushButton(parent) {

}

void CloseButton::enterEvent(QEnterEvent *event)
{
    this->setIcon(QIcon(":/resource/image/close_active.png"));
}

void CloseButton::leaveEvent(QEvent *event)
{
    this->setIcon(QIcon(":/resource/image/close_inactive.png"));
}
