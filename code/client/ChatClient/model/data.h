#pragma once

#include <QString>
#include <QIcon>
#include <QUuid>
#include <QDateTime>
#include <QDebug>
#include <QFileInfo>
#include <QFile>
#include <QPixmap>

namespace model{

static inline QString getFileName(const QString &path)
{
    QFileInfo info(path);
    return info.fileName();
}

#define TAG QString("[%1:%2]").arg(model::getFileName(__FILE__),QString::number(__LINE__))
#define LOG() qDebug().noquote()<<TAG


static inline int64_t getTime()
{
    return QDateTime::currentSecsSinceEpoch();
}


static inline QString formatTime(int64_t timestamp)
{
    QDateTime dateTime=QDateTime::fromSecsSinceEpoch(timestamp);
    return dateTime.toString("yyyy-MM-dd HH:mm::ss");
}

static inline QString makeId()
{
    return QUuid::createUuid().toString().sliced(25,12);
}

static inline QIcon makeIcon(const QByteArray &byteArray)
{
    QPixmap pixmap;
    pixmap.loadFromData(byteArray);
    QIcon icon(pixmap);
    return icon;
}

static inline QByteArray loadFileToByteArray(const QString &path)
{
    QFile file(path);
    bool ok=file.open(QFile::ReadOnly);
    if(ok==false)
    {
        LOG()<<" 文件打开失败";
        return QByteArray();
    }
    QByteArray content=file.readAll();
    file.close();
    return content;
}

static inline void writeByteArrayToFile(const QString &path,const QByteArray &content)
{
    QFile file(path);
    bool ok=file.open(QFile::WriteOnly);
    if(ok==false)
    {
        LOG()<<" 文件打开失败";
        return;
    }
    file.write(content);
    file.flush();
    file.close();
    return;
}

class UserInfo
{
public:
    QString userId="";
    QString nickname="";
    QString phone="";
    QString description="";
    QIcon avatar;
};

enum MessageType{
    TEXT_TYPE,
    IMAGE_TYPE,
    FILE_TYPE,
    SPEECH_TYPE
};

class Message
{
public:
    static Message makeMessage(MessageType messageType,const QString &chatSessionId,const UserInfo &sender,const QByteArray &content,const QString &extraInfo)
    {
        if(messageType==TEXT_TYPE)
        {
            return makeTextMessage(chatSessionId,sender,content);
        }
        else if(messageType==IMAGE_TYPE)
        {
            return makeImageMessage(chatSessionId,sender,content);
        }
        else if(messageType==FILE_TYPE)
        {
            return makeFileMessage(chatSessionId,sender,content,extraInfo);
        }
        else if(messageType==SPEECH_TYPE)
        {
            return makeSpeechMessage(chatSessionId,sender,content);
        }
        else
        {
            return Message();
        }
    }
private:

    static Message makeTextMessage(const QString &chatSessionId,const UserInfo &sender,const QByteArray &content)
    {
        Message message;
        message.chatSessionId=chatSessionId;
        message.messageType=TEXT_TYPE;
        message.messageId=makeId();
        message.content=content;
        message.time=formatTime(getTime());
        message.sender=sender;
        message.fileId="";
        message.fileName="";
    }
    static Message makeImageMessage(const QString &chatSessionId,const UserInfo &sender,const QByteArray &content)
    {
        Message message;
        message.chatSessionId=chatSessionId;
        message.messageType=IMAGE_TYPE;
        message.messageId=makeId();
        message.content=content;
        message.time=formatTime(getTime());
        message.sender=sender;
        message.fileId="";
        message.fileName="";
    }
    static Message makeFileMessage(const QString &chatSessionId,const UserInfo &sender,const QByteArray &content,const QString &fileName)
    {
        Message message;
        message.chatSessionId=chatSessionId;
        message.messageType=FILE_TYPE;
        message.messageId=makeId();
        message.content=content;
        message.time=formatTime(getTime());
        message.sender=sender;
        message.fileId="";
        message.fileName=fileName;
    }
    static Message makeSpeechMessage(const QString &chatSessionId,const UserInfo &sender,const QByteArray &content)
    {
        Message message;
        message.chatSessionId=chatSessionId;
        message.messageType=SPEECH_TYPE;
        message.messageId=makeId();
        message.content=content;
        message.time=formatTime(getTime());
        message.sender=sender;
        message.fileId="";
        message.fileName="";
    }
public:
    QString messageId="";
    QString chatSessionId="";
    QString time="";
    UserInfo sender;
    MessageType messageType;
    QIcon avatar;
    QByteArray content;
    QString fileId="";
    QString fileName="";
};

class ChatSessionInfo
{
public:
    QString chatSessionId="";
    QString chatSessionName="";
    QString userId="";
    Message lastMessage;
    QIcon avatar;
};
} // end model
