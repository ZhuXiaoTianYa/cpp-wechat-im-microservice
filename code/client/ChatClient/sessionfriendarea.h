#ifndef SESSIONFRIENDAREA_H
#define SESSIONFRIENDAREA_H

#include <QWidget>
#include <QScrollArea>
#include <QScrollBar>
#include <QVBoxLayout>
#include <QPushButton>

class SessionFriendArea : public QScrollArea
{
    Q_OBJECT
public:
    explicit SessionFriendArea(QWidget *parent = nullptr);

signals:

private:
    QWidget* container;
};

#endif // SESSIONFRIENDAREA_H
