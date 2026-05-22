import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace im_server. */
export namespace im_server {

    /** Properties of a UserInfo. */
    interface IUserInfo {

        /** UserInfo userId */
        userId?: (string|null);

        /** UserInfo nickname */
        nickname?: (string|null);

        /** UserInfo description */
        description?: (string|null);

        /** UserInfo phone */
        phone?: (string|null);

        /** UserInfo avatar */
        avatar?: (Uint8Array|null);
    }

    /** Represents a UserInfo. */
    class UserInfo implements IUserInfo {

        /**
         * Constructs a new UserInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IUserInfo);

        /** UserInfo userId. */
        public userId: string;

        /** UserInfo nickname. */
        public nickname: string;

        /** UserInfo description. */
        public description: string;

        /** UserInfo phone. */
        public phone: string;

        /** UserInfo avatar. */
        public avatar: Uint8Array;

        /**
         * Creates a new UserInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserInfo instance
         */
        public static create(properties?: im_server.IUserInfo): im_server.UserInfo;

        /**
         * Encodes the specified UserInfo message. Does not implicitly {@link im_server.UserInfo.verify|verify} messages.
         * @param message UserInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IUserInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserInfo message, length delimited. Does not implicitly {@link im_server.UserInfo.verify|verify} messages.
         * @param message UserInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IUserInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.UserInfo;

        /**
         * Decodes a UserInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.UserInfo;

        /**
         * Verifies a UserInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserInfo
         */
        public static fromObject(object: { [k: string]: any }): im_server.UserInfo;

        /**
         * Creates a plain object from a UserInfo message. Also converts values to other types if specified.
         * @param message UserInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.UserInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UserInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ChatSessionInfo. */
    interface IChatSessionInfo {

        /** ChatSessionInfo singleChatFriendId */
        singleChatFriendId?: (string|null);

        /** ChatSessionInfo chatSessionId */
        chatSessionId?: (string|null);

        /** ChatSessionInfo chatSessionName */
        chatSessionName?: (string|null);

        /** ChatSessionInfo prevMessage */
        prevMessage?: (im_server.IMessageInfo|null);

        /** ChatSessionInfo avatar */
        avatar?: (Uint8Array|null);
    }

    /** Represents a ChatSessionInfo. */
    class ChatSessionInfo implements IChatSessionInfo {

        /**
         * Constructs a new ChatSessionInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IChatSessionInfo);

        /** ChatSessionInfo singleChatFriendId. */
        public singleChatFriendId?: (string|null);

        /** ChatSessionInfo chatSessionId. */
        public chatSessionId: string;

        /** ChatSessionInfo chatSessionName. */
        public chatSessionName: string;

        /** ChatSessionInfo prevMessage. */
        public prevMessage?: (im_server.IMessageInfo|null);

        /** ChatSessionInfo avatar. */
        public avatar?: (Uint8Array|null);

        /**
         * Creates a new ChatSessionInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatSessionInfo instance
         */
        public static create(properties?: im_server.IChatSessionInfo): im_server.ChatSessionInfo;

        /**
         * Encodes the specified ChatSessionInfo message. Does not implicitly {@link im_server.ChatSessionInfo.verify|verify} messages.
         * @param message ChatSessionInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IChatSessionInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChatSessionInfo message, length delimited. Does not implicitly {@link im_server.ChatSessionInfo.verify|verify} messages.
         * @param message ChatSessionInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IChatSessionInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatSessionInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatSessionInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.ChatSessionInfo;

        /**
         * Decodes a ChatSessionInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChatSessionInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.ChatSessionInfo;

        /**
         * Verifies a ChatSessionInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChatSessionInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChatSessionInfo
         */
        public static fromObject(object: { [k: string]: any }): im_server.ChatSessionInfo;

        /**
         * Creates a plain object from a ChatSessionInfo message. Also converts values to other types if specified.
         * @param message ChatSessionInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.ChatSessionInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChatSessionInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ChatSessionInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** MessageType enum. */
    enum MessageType {
        STRING = 0,
        IMAGE = 1,
        FILE = 2,
        SPEECH = 3
    }

    /** Properties of a StringMessageInfo. */
    interface IStringMessageInfo {

        /** StringMessageInfo content */
        content?: (string|null);
    }

    /** Represents a StringMessageInfo. */
    class StringMessageInfo implements IStringMessageInfo {

        /**
         * Constructs a new StringMessageInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IStringMessageInfo);

        /** StringMessageInfo content. */
        public content: string;

        /**
         * Creates a new StringMessageInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StringMessageInfo instance
         */
        public static create(properties?: im_server.IStringMessageInfo): im_server.StringMessageInfo;

        /**
         * Encodes the specified StringMessageInfo message. Does not implicitly {@link im_server.StringMessageInfo.verify|verify} messages.
         * @param message StringMessageInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IStringMessageInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StringMessageInfo message, length delimited. Does not implicitly {@link im_server.StringMessageInfo.verify|verify} messages.
         * @param message StringMessageInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IStringMessageInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StringMessageInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StringMessageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.StringMessageInfo;

        /**
         * Decodes a StringMessageInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StringMessageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.StringMessageInfo;

        /**
         * Verifies a StringMessageInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StringMessageInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StringMessageInfo
         */
        public static fromObject(object: { [k: string]: any }): im_server.StringMessageInfo;

        /**
         * Creates a plain object from a StringMessageInfo message. Also converts values to other types if specified.
         * @param message StringMessageInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.StringMessageInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StringMessageInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for StringMessageInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ImageMessageInfo. */
    interface IImageMessageInfo {

        /** ImageMessageInfo fileId */
        fileId?: (string|null);

        /** ImageMessageInfo imageContent */
        imageContent?: (Uint8Array|null);
    }

    /** Represents an ImageMessageInfo. */
    class ImageMessageInfo implements IImageMessageInfo {

        /**
         * Constructs a new ImageMessageInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IImageMessageInfo);

        /** ImageMessageInfo fileId. */
        public fileId?: (string|null);

        /** ImageMessageInfo imageContent. */
        public imageContent?: (Uint8Array|null);

        /**
         * Creates a new ImageMessageInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ImageMessageInfo instance
         */
        public static create(properties?: im_server.IImageMessageInfo): im_server.ImageMessageInfo;

        /**
         * Encodes the specified ImageMessageInfo message. Does not implicitly {@link im_server.ImageMessageInfo.verify|verify} messages.
         * @param message ImageMessageInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IImageMessageInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ImageMessageInfo message, length delimited. Does not implicitly {@link im_server.ImageMessageInfo.verify|verify} messages.
         * @param message ImageMessageInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IImageMessageInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ImageMessageInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ImageMessageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.ImageMessageInfo;

        /**
         * Decodes an ImageMessageInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ImageMessageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.ImageMessageInfo;

        /**
         * Verifies an ImageMessageInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ImageMessageInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ImageMessageInfo
         */
        public static fromObject(object: { [k: string]: any }): im_server.ImageMessageInfo;

        /**
         * Creates a plain object from an ImageMessageInfo message. Also converts values to other types if specified.
         * @param message ImageMessageInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.ImageMessageInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ImageMessageInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ImageMessageInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FileMessageInfo. */
    interface IFileMessageInfo {

        /** FileMessageInfo fileId */
        fileId?: (string|null);

        /** FileMessageInfo fileSize */
        fileSize?: (number|Long|null);

        /** FileMessageInfo fileName */
        fileName?: (string|null);

        /** FileMessageInfo fileContents */
        fileContents?: (Uint8Array|null);
    }

    /** Represents a FileMessageInfo. */
    class FileMessageInfo implements IFileMessageInfo {

        /**
         * Constructs a new FileMessageInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IFileMessageInfo);

        /** FileMessageInfo fileId. */
        public fileId?: (string|null);

        /** FileMessageInfo fileSize. */
        public fileSize?: (number|Long|null);

        /** FileMessageInfo fileName. */
        public fileName?: (string|null);

        /** FileMessageInfo fileContents. */
        public fileContents?: (Uint8Array|null);

        /**
         * Creates a new FileMessageInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FileMessageInfo instance
         */
        public static create(properties?: im_server.IFileMessageInfo): im_server.FileMessageInfo;

        /**
         * Encodes the specified FileMessageInfo message. Does not implicitly {@link im_server.FileMessageInfo.verify|verify} messages.
         * @param message FileMessageInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IFileMessageInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FileMessageInfo message, length delimited. Does not implicitly {@link im_server.FileMessageInfo.verify|verify} messages.
         * @param message FileMessageInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IFileMessageInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FileMessageInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FileMessageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.FileMessageInfo;

        /**
         * Decodes a FileMessageInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FileMessageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.FileMessageInfo;

        /**
         * Verifies a FileMessageInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FileMessageInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FileMessageInfo
         */
        public static fromObject(object: { [k: string]: any }): im_server.FileMessageInfo;

        /**
         * Creates a plain object from a FileMessageInfo message. Also converts values to other types if specified.
         * @param message FileMessageInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.FileMessageInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FileMessageInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FileMessageInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SpeechMessageInfo. */
    interface ISpeechMessageInfo {

        /** SpeechMessageInfo fileId */
        fileId?: (string|null);

        /** SpeechMessageInfo fileContents */
        fileContents?: (Uint8Array|null);
    }

    /** Represents a SpeechMessageInfo. */
    class SpeechMessageInfo implements ISpeechMessageInfo {

        /**
         * Constructs a new SpeechMessageInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.ISpeechMessageInfo);

        /** SpeechMessageInfo fileId. */
        public fileId?: (string|null);

        /** SpeechMessageInfo fileContents. */
        public fileContents?: (Uint8Array|null);

        /**
         * Creates a new SpeechMessageInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SpeechMessageInfo instance
         */
        public static create(properties?: im_server.ISpeechMessageInfo): im_server.SpeechMessageInfo;

        /**
         * Encodes the specified SpeechMessageInfo message. Does not implicitly {@link im_server.SpeechMessageInfo.verify|verify} messages.
         * @param message SpeechMessageInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.ISpeechMessageInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SpeechMessageInfo message, length delimited. Does not implicitly {@link im_server.SpeechMessageInfo.verify|verify} messages.
         * @param message SpeechMessageInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.ISpeechMessageInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SpeechMessageInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SpeechMessageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.SpeechMessageInfo;

        /**
         * Decodes a SpeechMessageInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SpeechMessageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.SpeechMessageInfo;

        /**
         * Verifies a SpeechMessageInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SpeechMessageInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SpeechMessageInfo
         */
        public static fromObject(object: { [k: string]: any }): im_server.SpeechMessageInfo;

        /**
         * Creates a plain object from a SpeechMessageInfo message. Also converts values to other types if specified.
         * @param message SpeechMessageInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.SpeechMessageInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SpeechMessageInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SpeechMessageInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageContent. */
    interface IMessageContent {

        /** MessageContent messageType */
        messageType?: (im_server.MessageType|null);

        /** MessageContent stringMessage */
        stringMessage?: (im_server.IStringMessageInfo|null);

        /** MessageContent fileMessage */
        fileMessage?: (im_server.IFileMessageInfo|null);

        /** MessageContent speechMessage */
        speechMessage?: (im_server.ISpeechMessageInfo|null);

        /** MessageContent imageMessage */
        imageMessage?: (im_server.IImageMessageInfo|null);
    }

    /** Represents a MessageContent. */
    class MessageContent implements IMessageContent {

        /**
         * Constructs a new MessageContent.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IMessageContent);

        /** MessageContent messageType. */
        public messageType: im_server.MessageType;

        /** MessageContent stringMessage. */
        public stringMessage?: (im_server.IStringMessageInfo|null);

        /** MessageContent fileMessage. */
        public fileMessage?: (im_server.IFileMessageInfo|null);

        /** MessageContent speechMessage. */
        public speechMessage?: (im_server.ISpeechMessageInfo|null);

        /** MessageContent imageMessage. */
        public imageMessage?: (im_server.IImageMessageInfo|null);

        /** MessageContent msgContent. */
        public msgContent?: ("stringMessage"|"fileMessage"|"speechMessage"|"imageMessage");

        /**
         * Creates a new MessageContent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageContent instance
         */
        public static create(properties?: im_server.IMessageContent): im_server.MessageContent;

        /**
         * Encodes the specified MessageContent message. Does not implicitly {@link im_server.MessageContent.verify|verify} messages.
         * @param message MessageContent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IMessageContent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageContent message, length delimited. Does not implicitly {@link im_server.MessageContent.verify|verify} messages.
         * @param message MessageContent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IMessageContent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageContent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageContent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.MessageContent;

        /**
         * Decodes a MessageContent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageContent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.MessageContent;

        /**
         * Verifies a MessageContent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageContent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageContent
         */
        public static fromObject(object: { [k: string]: any }): im_server.MessageContent;

        /**
         * Creates a plain object from a MessageContent message. Also converts values to other types if specified.
         * @param message MessageContent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.MessageContent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageContent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageContent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageInfo. */
    interface IMessageInfo {

        /** MessageInfo messageId */
        messageId?: (string|null);

        /** MessageInfo chatSessionId */
        chatSessionId?: (string|null);

        /** MessageInfo timestamp */
        timestamp?: (number|Long|null);

        /** MessageInfo sender */
        sender?: (im_server.IUserInfo|null);

        /** MessageInfo message */
        message?: (im_server.IMessageContent|null);
    }

    /** Represents a MessageInfo. */
    class MessageInfo implements IMessageInfo {

        /**
         * Constructs a new MessageInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IMessageInfo);

        /** MessageInfo messageId. */
        public messageId: string;

        /** MessageInfo chatSessionId. */
        public chatSessionId: string;

        /** MessageInfo timestamp. */
        public timestamp: (number|Long);

        /** MessageInfo sender. */
        public sender?: (im_server.IUserInfo|null);

        /** MessageInfo message. */
        public message?: (im_server.IMessageContent|null);

        /**
         * Creates a new MessageInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageInfo instance
         */
        public static create(properties?: im_server.IMessageInfo): im_server.MessageInfo;

        /**
         * Encodes the specified MessageInfo message. Does not implicitly {@link im_server.MessageInfo.verify|verify} messages.
         * @param message MessageInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IMessageInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageInfo message, length delimited. Does not implicitly {@link im_server.MessageInfo.verify|verify} messages.
         * @param message MessageInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IMessageInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.MessageInfo;

        /**
         * Decodes a MessageInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.MessageInfo;

        /**
         * Verifies a MessageInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageInfo
         */
        public static fromObject(object: { [k: string]: any }): im_server.MessageInfo;

        /**
         * Creates a plain object from a MessageInfo message. Also converts values to other types if specified.
         * @param message MessageInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.MessageInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FileDownloadData. */
    interface IFileDownloadData {

        /** FileDownloadData fileId */
        fileId?: (string|null);

        /** FileDownloadData fileContent */
        fileContent?: (Uint8Array|null);
    }

    /** Represents a FileDownloadData. */
    class FileDownloadData implements IFileDownloadData {

        /**
         * Constructs a new FileDownloadData.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IFileDownloadData);

        /** FileDownloadData fileId. */
        public fileId: string;

        /** FileDownloadData fileContent. */
        public fileContent: Uint8Array;

        /**
         * Creates a new FileDownloadData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FileDownloadData instance
         */
        public static create(properties?: im_server.IFileDownloadData): im_server.FileDownloadData;

        /**
         * Encodes the specified FileDownloadData message. Does not implicitly {@link im_server.FileDownloadData.verify|verify} messages.
         * @param message FileDownloadData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IFileDownloadData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FileDownloadData message, length delimited. Does not implicitly {@link im_server.FileDownloadData.verify|verify} messages.
         * @param message FileDownloadData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IFileDownloadData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FileDownloadData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FileDownloadData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.FileDownloadData;

        /**
         * Decodes a FileDownloadData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FileDownloadData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.FileDownloadData;

        /**
         * Verifies a FileDownloadData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FileDownloadData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FileDownloadData
         */
        public static fromObject(object: { [k: string]: any }): im_server.FileDownloadData;

        /**
         * Creates a plain object from a FileDownloadData message. Also converts values to other types if specified.
         * @param message FileDownloadData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.FileDownloadData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FileDownloadData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FileDownloadData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FileUploadData. */
    interface IFileUploadData {

        /** FileUploadData fileName */
        fileName?: (string|null);

        /** FileUploadData fileSize */
        fileSize?: (number|Long|null);

        /** FileUploadData fileContent */
        fileContent?: (Uint8Array|null);
    }

    /** Represents a FileUploadData. */
    class FileUploadData implements IFileUploadData {

        /**
         * Constructs a new FileUploadData.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IFileUploadData);

        /** FileUploadData fileName. */
        public fileName: string;

        /** FileUploadData fileSize. */
        public fileSize: (number|Long);

        /** FileUploadData fileContent. */
        public fileContent: Uint8Array;

        /**
         * Creates a new FileUploadData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FileUploadData instance
         */
        public static create(properties?: im_server.IFileUploadData): im_server.FileUploadData;

        /**
         * Encodes the specified FileUploadData message. Does not implicitly {@link im_server.FileUploadData.verify|verify} messages.
         * @param message FileUploadData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IFileUploadData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FileUploadData message, length delimited. Does not implicitly {@link im_server.FileUploadData.verify|verify} messages.
         * @param message FileUploadData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IFileUploadData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FileUploadData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FileUploadData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.FileUploadData;

        /**
         * Decodes a FileUploadData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FileUploadData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.FileUploadData;

        /**
         * Verifies a FileUploadData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FileUploadData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FileUploadData
         */
        public static fromObject(object: { [k: string]: any }): im_server.FileUploadData;

        /**
         * Creates a plain object from a FileUploadData message. Also converts values to other types if specified.
         * @param message FileUploadData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.FileUploadData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FileUploadData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FileUploadData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetSingleFileReq. */
    interface IGetSingleFileReq {

        /** GetSingleFileReq requestId */
        requestId?: (string|null);

        /** GetSingleFileReq fileId */
        fileId?: (string|null);

        /** GetSingleFileReq userId */
        userId?: (string|null);

        /** GetSingleFileReq sessionId */
        sessionId?: (string|null);
    }

    /** Represents a GetSingleFileReq. */
    class GetSingleFileReq implements IGetSingleFileReq {

        /**
         * Constructs a new GetSingleFileReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetSingleFileReq);

        /** GetSingleFileReq requestId. */
        public requestId: string;

        /** GetSingleFileReq fileId. */
        public fileId: string;

        /** GetSingleFileReq userId. */
        public userId?: (string|null);

        /** GetSingleFileReq sessionId. */
        public sessionId?: (string|null);

        /**
         * Creates a new GetSingleFileReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetSingleFileReq instance
         */
        public static create(properties?: im_server.IGetSingleFileReq): im_server.GetSingleFileReq;

        /**
         * Encodes the specified GetSingleFileReq message. Does not implicitly {@link im_server.GetSingleFileReq.verify|verify} messages.
         * @param message GetSingleFileReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetSingleFileReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetSingleFileReq message, length delimited. Does not implicitly {@link im_server.GetSingleFileReq.verify|verify} messages.
         * @param message GetSingleFileReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetSingleFileReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetSingleFileReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetSingleFileReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetSingleFileReq;

        /**
         * Decodes a GetSingleFileReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetSingleFileReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetSingleFileReq;

        /**
         * Verifies a GetSingleFileReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetSingleFileReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetSingleFileReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetSingleFileReq;

        /**
         * Creates a plain object from a GetSingleFileReq message. Also converts values to other types if specified.
         * @param message GetSingleFileReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetSingleFileReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetSingleFileReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetSingleFileReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetSingleFileRsp. */
    interface IGetSingleFileRsp {

        /** GetSingleFileRsp requestId */
        requestId?: (string|null);

        /** GetSingleFileRsp success */
        success?: (boolean|null);

        /** GetSingleFileRsp errmsg */
        errmsg?: (string|null);

        /** GetSingleFileRsp fileData */
        fileData?: (im_server.IFileDownloadData|null);
    }

    /** Represents a GetSingleFileRsp. */
    class GetSingleFileRsp implements IGetSingleFileRsp {

        /**
         * Constructs a new GetSingleFileRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetSingleFileRsp);

        /** GetSingleFileRsp requestId. */
        public requestId: string;

        /** GetSingleFileRsp success. */
        public success: boolean;

        /** GetSingleFileRsp errmsg. */
        public errmsg: string;

        /** GetSingleFileRsp fileData. */
        public fileData?: (im_server.IFileDownloadData|null);

        /**
         * Creates a new GetSingleFileRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetSingleFileRsp instance
         */
        public static create(properties?: im_server.IGetSingleFileRsp): im_server.GetSingleFileRsp;

        /**
         * Encodes the specified GetSingleFileRsp message. Does not implicitly {@link im_server.GetSingleFileRsp.verify|verify} messages.
         * @param message GetSingleFileRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetSingleFileRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetSingleFileRsp message, length delimited. Does not implicitly {@link im_server.GetSingleFileRsp.verify|verify} messages.
         * @param message GetSingleFileRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetSingleFileRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetSingleFileRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetSingleFileRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetSingleFileRsp;

        /**
         * Decodes a GetSingleFileRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetSingleFileRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetSingleFileRsp;

        /**
         * Verifies a GetSingleFileRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetSingleFileRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetSingleFileRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetSingleFileRsp;

        /**
         * Creates a plain object from a GetSingleFileRsp message. Also converts values to other types if specified.
         * @param message GetSingleFileRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetSingleFileRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetSingleFileRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetSingleFileRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetMultiFileReq. */
    interface IGetMultiFileReq {

        /** GetMultiFileReq requestId */
        requestId?: (string|null);

        /** GetMultiFileReq userId */
        userId?: (string|null);

        /** GetMultiFileReq sessionId */
        sessionId?: (string|null);

        /** GetMultiFileReq fileIdList */
        fileIdList?: (string[]|null);
    }

    /** Represents a GetMultiFileReq. */
    class GetMultiFileReq implements IGetMultiFileReq {

        /**
         * Constructs a new GetMultiFileReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetMultiFileReq);

        /** GetMultiFileReq requestId. */
        public requestId: string;

        /** GetMultiFileReq userId. */
        public userId?: (string|null);

        /** GetMultiFileReq sessionId. */
        public sessionId?: (string|null);

        /** GetMultiFileReq fileIdList. */
        public fileIdList: string[];

        /**
         * Creates a new GetMultiFileReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetMultiFileReq instance
         */
        public static create(properties?: im_server.IGetMultiFileReq): im_server.GetMultiFileReq;

        /**
         * Encodes the specified GetMultiFileReq message. Does not implicitly {@link im_server.GetMultiFileReq.verify|verify} messages.
         * @param message GetMultiFileReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetMultiFileReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetMultiFileReq message, length delimited. Does not implicitly {@link im_server.GetMultiFileReq.verify|verify} messages.
         * @param message GetMultiFileReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetMultiFileReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetMultiFileReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetMultiFileReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetMultiFileReq;

        /**
         * Decodes a GetMultiFileReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetMultiFileReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetMultiFileReq;

        /**
         * Verifies a GetMultiFileReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetMultiFileReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetMultiFileReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetMultiFileReq;

        /**
         * Creates a plain object from a GetMultiFileReq message. Also converts values to other types if specified.
         * @param message GetMultiFileReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetMultiFileReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetMultiFileReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetMultiFileReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetMultiFileRsp. */
    interface IGetMultiFileRsp {

        /** GetMultiFileRsp requestId */
        requestId?: (string|null);

        /** GetMultiFileRsp success */
        success?: (boolean|null);

        /** GetMultiFileRsp errmsg */
        errmsg?: (string|null);

        /** GetMultiFileRsp fileData */
        fileData?: ({ [k: string]: im_server.IFileDownloadData }|null);
    }

    /** Represents a GetMultiFileRsp. */
    class GetMultiFileRsp implements IGetMultiFileRsp {

        /**
         * Constructs a new GetMultiFileRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetMultiFileRsp);

        /** GetMultiFileRsp requestId. */
        public requestId: string;

        /** GetMultiFileRsp success. */
        public success: boolean;

        /** GetMultiFileRsp errmsg. */
        public errmsg: string;

        /** GetMultiFileRsp fileData. */
        public fileData: { [k: string]: im_server.IFileDownloadData };

        /**
         * Creates a new GetMultiFileRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetMultiFileRsp instance
         */
        public static create(properties?: im_server.IGetMultiFileRsp): im_server.GetMultiFileRsp;

        /**
         * Encodes the specified GetMultiFileRsp message. Does not implicitly {@link im_server.GetMultiFileRsp.verify|verify} messages.
         * @param message GetMultiFileRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetMultiFileRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetMultiFileRsp message, length delimited. Does not implicitly {@link im_server.GetMultiFileRsp.verify|verify} messages.
         * @param message GetMultiFileRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetMultiFileRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetMultiFileRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetMultiFileRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetMultiFileRsp;

        /**
         * Decodes a GetMultiFileRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetMultiFileRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetMultiFileRsp;

        /**
         * Verifies a GetMultiFileRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetMultiFileRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetMultiFileRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetMultiFileRsp;

        /**
         * Creates a plain object from a GetMultiFileRsp message. Also converts values to other types if specified.
         * @param message GetMultiFileRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetMultiFileRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetMultiFileRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetMultiFileRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PutSingleFileReq. */
    interface IPutSingleFileReq {

        /** PutSingleFileReq requestId */
        requestId?: (string|null);

        /** PutSingleFileReq userId */
        userId?: (string|null);

        /** PutSingleFileReq sessionId */
        sessionId?: (string|null);

        /** PutSingleFileReq fileData */
        fileData?: (im_server.IFileUploadData|null);
    }

    /** Represents a PutSingleFileReq. */
    class PutSingleFileReq implements IPutSingleFileReq {

        /**
         * Constructs a new PutSingleFileReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IPutSingleFileReq);

        /** PutSingleFileReq requestId. */
        public requestId: string;

        /** PutSingleFileReq userId. */
        public userId?: (string|null);

        /** PutSingleFileReq sessionId. */
        public sessionId?: (string|null);

        /** PutSingleFileReq fileData. */
        public fileData?: (im_server.IFileUploadData|null);

        /**
         * Creates a new PutSingleFileReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PutSingleFileReq instance
         */
        public static create(properties?: im_server.IPutSingleFileReq): im_server.PutSingleFileReq;

        /**
         * Encodes the specified PutSingleFileReq message. Does not implicitly {@link im_server.PutSingleFileReq.verify|verify} messages.
         * @param message PutSingleFileReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IPutSingleFileReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PutSingleFileReq message, length delimited. Does not implicitly {@link im_server.PutSingleFileReq.verify|verify} messages.
         * @param message PutSingleFileReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IPutSingleFileReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PutSingleFileReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PutSingleFileReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.PutSingleFileReq;

        /**
         * Decodes a PutSingleFileReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PutSingleFileReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.PutSingleFileReq;

        /**
         * Verifies a PutSingleFileReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PutSingleFileReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PutSingleFileReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.PutSingleFileReq;

        /**
         * Creates a plain object from a PutSingleFileReq message. Also converts values to other types if specified.
         * @param message PutSingleFileReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.PutSingleFileReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PutSingleFileReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PutSingleFileReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PutSingleFileRsp. */
    interface IPutSingleFileRsp {

        /** PutSingleFileRsp requestId */
        requestId?: (string|null);

        /** PutSingleFileRsp success */
        success?: (boolean|null);

        /** PutSingleFileRsp errmsg */
        errmsg?: (string|null);

        /** PutSingleFileRsp fileInfo */
        fileInfo?: (im_server.IFileMessageInfo|null);
    }

    /** Represents a PutSingleFileRsp. */
    class PutSingleFileRsp implements IPutSingleFileRsp {

        /**
         * Constructs a new PutSingleFileRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IPutSingleFileRsp);

        /** PutSingleFileRsp requestId. */
        public requestId: string;

        /** PutSingleFileRsp success. */
        public success: boolean;

        /** PutSingleFileRsp errmsg. */
        public errmsg: string;

        /** PutSingleFileRsp fileInfo. */
        public fileInfo?: (im_server.IFileMessageInfo|null);

        /**
         * Creates a new PutSingleFileRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PutSingleFileRsp instance
         */
        public static create(properties?: im_server.IPutSingleFileRsp): im_server.PutSingleFileRsp;

        /**
         * Encodes the specified PutSingleFileRsp message. Does not implicitly {@link im_server.PutSingleFileRsp.verify|verify} messages.
         * @param message PutSingleFileRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IPutSingleFileRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PutSingleFileRsp message, length delimited. Does not implicitly {@link im_server.PutSingleFileRsp.verify|verify} messages.
         * @param message PutSingleFileRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IPutSingleFileRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PutSingleFileRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PutSingleFileRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.PutSingleFileRsp;

        /**
         * Decodes a PutSingleFileRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PutSingleFileRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.PutSingleFileRsp;

        /**
         * Verifies a PutSingleFileRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PutSingleFileRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PutSingleFileRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.PutSingleFileRsp;

        /**
         * Creates a plain object from a PutSingleFileRsp message. Also converts values to other types if specified.
         * @param message PutSingleFileRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.PutSingleFileRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PutSingleFileRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PutSingleFileRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PutMultiFileReq. */
    interface IPutMultiFileReq {

        /** PutMultiFileReq requestId */
        requestId?: (string|null);

        /** PutMultiFileReq userId */
        userId?: (string|null);

        /** PutMultiFileReq sessionId */
        sessionId?: (string|null);

        /** PutMultiFileReq fileData */
        fileData?: (im_server.IFileUploadData[]|null);
    }

    /** Represents a PutMultiFileReq. */
    class PutMultiFileReq implements IPutMultiFileReq {

        /**
         * Constructs a new PutMultiFileReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IPutMultiFileReq);

        /** PutMultiFileReq requestId. */
        public requestId: string;

        /** PutMultiFileReq userId. */
        public userId?: (string|null);

        /** PutMultiFileReq sessionId. */
        public sessionId?: (string|null);

        /** PutMultiFileReq fileData. */
        public fileData: im_server.IFileUploadData[];

        /**
         * Creates a new PutMultiFileReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PutMultiFileReq instance
         */
        public static create(properties?: im_server.IPutMultiFileReq): im_server.PutMultiFileReq;

        /**
         * Encodes the specified PutMultiFileReq message. Does not implicitly {@link im_server.PutMultiFileReq.verify|verify} messages.
         * @param message PutMultiFileReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IPutMultiFileReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PutMultiFileReq message, length delimited. Does not implicitly {@link im_server.PutMultiFileReq.verify|verify} messages.
         * @param message PutMultiFileReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IPutMultiFileReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PutMultiFileReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PutMultiFileReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.PutMultiFileReq;

        /**
         * Decodes a PutMultiFileReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PutMultiFileReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.PutMultiFileReq;

        /**
         * Verifies a PutMultiFileReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PutMultiFileReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PutMultiFileReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.PutMultiFileReq;

        /**
         * Creates a plain object from a PutMultiFileReq message. Also converts values to other types if specified.
         * @param message PutMultiFileReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.PutMultiFileReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PutMultiFileReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PutMultiFileReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PutMultiFileRsp. */
    interface IPutMultiFileRsp {

        /** PutMultiFileRsp requestId */
        requestId?: (string|null);

        /** PutMultiFileRsp success */
        success?: (boolean|null);

        /** PutMultiFileRsp errmsg */
        errmsg?: (string|null);

        /** PutMultiFileRsp fileInfo */
        fileInfo?: (im_server.IFileMessageInfo[]|null);
    }

    /** Represents a PutMultiFileRsp. */
    class PutMultiFileRsp implements IPutMultiFileRsp {

        /**
         * Constructs a new PutMultiFileRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IPutMultiFileRsp);

        /** PutMultiFileRsp requestId. */
        public requestId: string;

        /** PutMultiFileRsp success. */
        public success: boolean;

        /** PutMultiFileRsp errmsg. */
        public errmsg: string;

        /** PutMultiFileRsp fileInfo. */
        public fileInfo: im_server.IFileMessageInfo[];

        /**
         * Creates a new PutMultiFileRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PutMultiFileRsp instance
         */
        public static create(properties?: im_server.IPutMultiFileRsp): im_server.PutMultiFileRsp;

        /**
         * Encodes the specified PutMultiFileRsp message. Does not implicitly {@link im_server.PutMultiFileRsp.verify|verify} messages.
         * @param message PutMultiFileRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IPutMultiFileRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PutMultiFileRsp message, length delimited. Does not implicitly {@link im_server.PutMultiFileRsp.verify|verify} messages.
         * @param message PutMultiFileRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IPutMultiFileRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PutMultiFileRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PutMultiFileRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.PutMultiFileRsp;

        /**
         * Decodes a PutMultiFileRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PutMultiFileRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.PutMultiFileRsp;

        /**
         * Verifies a PutMultiFileRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PutMultiFileRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PutMultiFileRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.PutMultiFileRsp;

        /**
         * Creates a plain object from a PutMultiFileRsp message. Also converts values to other types if specified.
         * @param message PutMultiFileRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.PutMultiFileRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PutMultiFileRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PutMultiFileRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Represents a FileService */
    class FileService extends $protobuf.rpc.Service {

        /**
         * Constructs a new FileService service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new FileService service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): FileService;

        /**
         * Calls GetSingleFile.
         * @param request GetSingleFileReq message or plain object
         * @param callback Node-style callback called with the error, if any, and GetSingleFileRsp
         */
        public getSingleFile(request: im_server.IGetSingleFileReq, callback: im_server.FileService.GetSingleFileCallback): void;

        /**
         * Calls GetSingleFile.
         * @param request GetSingleFileReq message or plain object
         * @returns Promise
         */
        public getSingleFile(request: im_server.IGetSingleFileReq): Promise<im_server.GetSingleFileRsp>;

        /**
         * Calls GetMultiFile.
         * @param request GetMultiFileReq message or plain object
         * @param callback Node-style callback called with the error, if any, and GetMultiFileRsp
         */
        public getMultiFile(request: im_server.IGetMultiFileReq, callback: im_server.FileService.GetMultiFileCallback): void;

        /**
         * Calls GetMultiFile.
         * @param request GetMultiFileReq message or plain object
         * @returns Promise
         */
        public getMultiFile(request: im_server.IGetMultiFileReq): Promise<im_server.GetMultiFileRsp>;

        /**
         * Calls PutSingleFile.
         * @param request PutSingleFileReq message or plain object
         * @param callback Node-style callback called with the error, if any, and PutSingleFileRsp
         */
        public putSingleFile(request: im_server.IPutSingleFileReq, callback: im_server.FileService.PutSingleFileCallback): void;

        /**
         * Calls PutSingleFile.
         * @param request PutSingleFileReq message or plain object
         * @returns Promise
         */
        public putSingleFile(request: im_server.IPutSingleFileReq): Promise<im_server.PutSingleFileRsp>;

        /**
         * Calls PutMultiFile.
         * @param request PutMultiFileReq message or plain object
         * @param callback Node-style callback called with the error, if any, and PutMultiFileRsp
         */
        public putMultiFile(request: im_server.IPutMultiFileReq, callback: im_server.FileService.PutMultiFileCallback): void;

        /**
         * Calls PutMultiFile.
         * @param request PutMultiFileReq message or plain object
         * @returns Promise
         */
        public putMultiFile(request: im_server.IPutMultiFileReq): Promise<im_server.PutMultiFileRsp>;
    }

    namespace FileService {

        /**
         * Callback as used by {@link im_server.FileService#getSingleFile}.
         * @param error Error, if any
         * @param [response] GetSingleFileRsp
         */
        type GetSingleFileCallback = (error: (Error|null), response?: im_server.GetSingleFileRsp) => void;

        /**
         * Callback as used by {@link im_server.FileService#getMultiFile}.
         * @param error Error, if any
         * @param [response] GetMultiFileRsp
         */
        type GetMultiFileCallback = (error: (Error|null), response?: im_server.GetMultiFileRsp) => void;

        /**
         * Callback as used by {@link im_server.FileService#putSingleFile}.
         * @param error Error, if any
         * @param [response] PutSingleFileRsp
         */
        type PutSingleFileCallback = (error: (Error|null), response?: im_server.PutSingleFileRsp) => void;

        /**
         * Callback as used by {@link im_server.FileService#putMultiFile}.
         * @param error Error, if any
         * @param [response] PutMultiFileRsp
         */
        type PutMultiFileCallback = (error: (Error|null), response?: im_server.PutMultiFileRsp) => void;
    }

    /** Properties of a GetFriendListReq. */
    interface IGetFriendListReq {

        /** GetFriendListReq requestId */
        requestId?: (string|null);

        /** GetFriendListReq userId */
        userId?: (string|null);

        /** GetFriendListReq sessionId */
        sessionId?: (string|null);
    }

    /** Represents a GetFriendListReq. */
    class GetFriendListReq implements IGetFriendListReq {

        /**
         * Constructs a new GetFriendListReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetFriendListReq);

        /** GetFriendListReq requestId. */
        public requestId: string;

        /** GetFriendListReq userId. */
        public userId?: (string|null);

        /** GetFriendListReq sessionId. */
        public sessionId?: (string|null);

        /**
         * Creates a new GetFriendListReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetFriendListReq instance
         */
        public static create(properties?: im_server.IGetFriendListReq): im_server.GetFriendListReq;

        /**
         * Encodes the specified GetFriendListReq message. Does not implicitly {@link im_server.GetFriendListReq.verify|verify} messages.
         * @param message GetFriendListReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetFriendListReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetFriendListReq message, length delimited. Does not implicitly {@link im_server.GetFriendListReq.verify|verify} messages.
         * @param message GetFriendListReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetFriendListReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetFriendListReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetFriendListReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetFriendListReq;

        /**
         * Decodes a GetFriendListReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetFriendListReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetFriendListReq;

        /**
         * Verifies a GetFriendListReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetFriendListReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetFriendListReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetFriendListReq;

        /**
         * Creates a plain object from a GetFriendListReq message. Also converts values to other types if specified.
         * @param message GetFriendListReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetFriendListReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetFriendListReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetFriendListReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetFriendListRsp. */
    interface IGetFriendListRsp {

        /** GetFriendListRsp requestId */
        requestId?: (string|null);

        /** GetFriendListRsp success */
        success?: (boolean|null);

        /** GetFriendListRsp errmsg */
        errmsg?: (string|null);

        /** GetFriendListRsp friendList */
        friendList?: (im_server.IUserInfo[]|null);
    }

    /** Represents a GetFriendListRsp. */
    class GetFriendListRsp implements IGetFriendListRsp {

        /**
         * Constructs a new GetFriendListRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetFriendListRsp);

        /** GetFriendListRsp requestId. */
        public requestId: string;

        /** GetFriendListRsp success. */
        public success: boolean;

        /** GetFriendListRsp errmsg. */
        public errmsg: string;

        /** GetFriendListRsp friendList. */
        public friendList: im_server.IUserInfo[];

        /**
         * Creates a new GetFriendListRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetFriendListRsp instance
         */
        public static create(properties?: im_server.IGetFriendListRsp): im_server.GetFriendListRsp;

        /**
         * Encodes the specified GetFriendListRsp message. Does not implicitly {@link im_server.GetFriendListRsp.verify|verify} messages.
         * @param message GetFriendListRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetFriendListRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetFriendListRsp message, length delimited. Does not implicitly {@link im_server.GetFriendListRsp.verify|verify} messages.
         * @param message GetFriendListRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetFriendListRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetFriendListRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetFriendListRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetFriendListRsp;

        /**
         * Decodes a GetFriendListRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetFriendListRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetFriendListRsp;

        /**
         * Verifies a GetFriendListRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetFriendListRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetFriendListRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetFriendListRsp;

        /**
         * Creates a plain object from a GetFriendListRsp message. Also converts values to other types if specified.
         * @param message GetFriendListRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetFriendListRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetFriendListRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetFriendListRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FriendRemoveReq. */
    interface IFriendRemoveReq {

        /** FriendRemoveReq requestId */
        requestId?: (string|null);

        /** FriendRemoveReq userId */
        userId?: (string|null);

        /** FriendRemoveReq sessionId */
        sessionId?: (string|null);

        /** FriendRemoveReq peerId */
        peerId?: (string|null);
    }

    /** Represents a FriendRemoveReq. */
    class FriendRemoveReq implements IFriendRemoveReq {

        /**
         * Constructs a new FriendRemoveReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IFriendRemoveReq);

        /** FriendRemoveReq requestId. */
        public requestId: string;

        /** FriendRemoveReq userId. */
        public userId?: (string|null);

        /** FriendRemoveReq sessionId. */
        public sessionId?: (string|null);

        /** FriendRemoveReq peerId. */
        public peerId: string;

        /**
         * Creates a new FriendRemoveReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FriendRemoveReq instance
         */
        public static create(properties?: im_server.IFriendRemoveReq): im_server.FriendRemoveReq;

        /**
         * Encodes the specified FriendRemoveReq message. Does not implicitly {@link im_server.FriendRemoveReq.verify|verify} messages.
         * @param message FriendRemoveReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IFriendRemoveReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FriendRemoveReq message, length delimited. Does not implicitly {@link im_server.FriendRemoveReq.verify|verify} messages.
         * @param message FriendRemoveReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IFriendRemoveReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FriendRemoveReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FriendRemoveReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.FriendRemoveReq;

        /**
         * Decodes a FriendRemoveReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FriendRemoveReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.FriendRemoveReq;

        /**
         * Verifies a FriendRemoveReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FriendRemoveReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FriendRemoveReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.FriendRemoveReq;

        /**
         * Creates a plain object from a FriendRemoveReq message. Also converts values to other types if specified.
         * @param message FriendRemoveReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.FriendRemoveReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FriendRemoveReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FriendRemoveReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FriendRemoveRsp. */
    interface IFriendRemoveRsp {

        /** FriendRemoveRsp requestId */
        requestId?: (string|null);

        /** FriendRemoveRsp success */
        success?: (boolean|null);

        /** FriendRemoveRsp errmsg */
        errmsg?: (string|null);
    }

    /** Represents a FriendRemoveRsp. */
    class FriendRemoveRsp implements IFriendRemoveRsp {

        /**
         * Constructs a new FriendRemoveRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IFriendRemoveRsp);

        /** FriendRemoveRsp requestId. */
        public requestId: string;

        /** FriendRemoveRsp success. */
        public success: boolean;

        /** FriendRemoveRsp errmsg. */
        public errmsg: string;

        /**
         * Creates a new FriendRemoveRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FriendRemoveRsp instance
         */
        public static create(properties?: im_server.IFriendRemoveRsp): im_server.FriendRemoveRsp;

        /**
         * Encodes the specified FriendRemoveRsp message. Does not implicitly {@link im_server.FriendRemoveRsp.verify|verify} messages.
         * @param message FriendRemoveRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IFriendRemoveRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FriendRemoveRsp message, length delimited. Does not implicitly {@link im_server.FriendRemoveRsp.verify|verify} messages.
         * @param message FriendRemoveRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IFriendRemoveRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FriendRemoveRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FriendRemoveRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.FriendRemoveRsp;

        /**
         * Decodes a FriendRemoveRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FriendRemoveRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.FriendRemoveRsp;

        /**
         * Verifies a FriendRemoveRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FriendRemoveRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FriendRemoveRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.FriendRemoveRsp;

        /**
         * Creates a plain object from a FriendRemoveRsp message. Also converts values to other types if specified.
         * @param message FriendRemoveRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.FriendRemoveRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FriendRemoveRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FriendRemoveRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FriendAddReq. */
    interface IFriendAddReq {

        /** FriendAddReq requestId */
        requestId?: (string|null);

        /** FriendAddReq sessionId */
        sessionId?: (string|null);

        /** FriendAddReq userId */
        userId?: (string|null);

        /** FriendAddReq respondentId */
        respondentId?: (string|null);
    }

    /** Represents a FriendAddReq. */
    class FriendAddReq implements IFriendAddReq {

        /**
         * Constructs a new FriendAddReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IFriendAddReq);

        /** FriendAddReq requestId. */
        public requestId: string;

        /** FriendAddReq sessionId. */
        public sessionId?: (string|null);

        /** FriendAddReq userId. */
        public userId?: (string|null);

        /** FriendAddReq respondentId. */
        public respondentId: string;

        /**
         * Creates a new FriendAddReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FriendAddReq instance
         */
        public static create(properties?: im_server.IFriendAddReq): im_server.FriendAddReq;

        /**
         * Encodes the specified FriendAddReq message. Does not implicitly {@link im_server.FriendAddReq.verify|verify} messages.
         * @param message FriendAddReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IFriendAddReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FriendAddReq message, length delimited. Does not implicitly {@link im_server.FriendAddReq.verify|verify} messages.
         * @param message FriendAddReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IFriendAddReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FriendAddReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FriendAddReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.FriendAddReq;

        /**
         * Decodes a FriendAddReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FriendAddReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.FriendAddReq;

        /**
         * Verifies a FriendAddReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FriendAddReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FriendAddReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.FriendAddReq;

        /**
         * Creates a plain object from a FriendAddReq message. Also converts values to other types if specified.
         * @param message FriendAddReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.FriendAddReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FriendAddReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FriendAddReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FriendAddRsp. */
    interface IFriendAddRsp {

        /** FriendAddRsp requestId */
        requestId?: (string|null);

        /** FriendAddRsp success */
        success?: (boolean|null);

        /** FriendAddRsp errmsg */
        errmsg?: (string|null);

        /** FriendAddRsp notifyEventId */
        notifyEventId?: (string|null);
    }

    /** Represents a FriendAddRsp. */
    class FriendAddRsp implements IFriendAddRsp {

        /**
         * Constructs a new FriendAddRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IFriendAddRsp);

        /** FriendAddRsp requestId. */
        public requestId: string;

        /** FriendAddRsp success. */
        public success: boolean;

        /** FriendAddRsp errmsg. */
        public errmsg: string;

        /** FriendAddRsp notifyEventId. */
        public notifyEventId: string;

        /**
         * Creates a new FriendAddRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FriendAddRsp instance
         */
        public static create(properties?: im_server.IFriendAddRsp): im_server.FriendAddRsp;

        /**
         * Encodes the specified FriendAddRsp message. Does not implicitly {@link im_server.FriendAddRsp.verify|verify} messages.
         * @param message FriendAddRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IFriendAddRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FriendAddRsp message, length delimited. Does not implicitly {@link im_server.FriendAddRsp.verify|verify} messages.
         * @param message FriendAddRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IFriendAddRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FriendAddRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FriendAddRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.FriendAddRsp;

        /**
         * Decodes a FriendAddRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FriendAddRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.FriendAddRsp;

        /**
         * Verifies a FriendAddRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FriendAddRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FriendAddRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.FriendAddRsp;

        /**
         * Creates a plain object from a FriendAddRsp message. Also converts values to other types if specified.
         * @param message FriendAddRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.FriendAddRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FriendAddRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FriendAddRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FriendAddProcessReq. */
    interface IFriendAddProcessReq {

        /** FriendAddProcessReq requestId */
        requestId?: (string|null);

        /** FriendAddProcessReq notifyEventId */
        notifyEventId?: (string|null);

        /** FriendAddProcessReq agree */
        agree?: (boolean|null);

        /** FriendAddProcessReq applyUserId */
        applyUserId?: (string|null);

        /** FriendAddProcessReq sessionId */
        sessionId?: (string|null);

        /** FriendAddProcessReq userId */
        userId?: (string|null);
    }

    /** Represents a FriendAddProcessReq. */
    class FriendAddProcessReq implements IFriendAddProcessReq {

        /**
         * Constructs a new FriendAddProcessReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IFriendAddProcessReq);

        /** FriendAddProcessReq requestId. */
        public requestId: string;

        /** FriendAddProcessReq notifyEventId. */
        public notifyEventId: string;

        /** FriendAddProcessReq agree. */
        public agree: boolean;

        /** FriendAddProcessReq applyUserId. */
        public applyUserId: string;

        /** FriendAddProcessReq sessionId. */
        public sessionId?: (string|null);

        /** FriendAddProcessReq userId. */
        public userId?: (string|null);

        /**
         * Creates a new FriendAddProcessReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FriendAddProcessReq instance
         */
        public static create(properties?: im_server.IFriendAddProcessReq): im_server.FriendAddProcessReq;

        /**
         * Encodes the specified FriendAddProcessReq message. Does not implicitly {@link im_server.FriendAddProcessReq.verify|verify} messages.
         * @param message FriendAddProcessReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IFriendAddProcessReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FriendAddProcessReq message, length delimited. Does not implicitly {@link im_server.FriendAddProcessReq.verify|verify} messages.
         * @param message FriendAddProcessReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IFriendAddProcessReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FriendAddProcessReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FriendAddProcessReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.FriendAddProcessReq;

        /**
         * Decodes a FriendAddProcessReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FriendAddProcessReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.FriendAddProcessReq;

        /**
         * Verifies a FriendAddProcessReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FriendAddProcessReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FriendAddProcessReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.FriendAddProcessReq;

        /**
         * Creates a plain object from a FriendAddProcessReq message. Also converts values to other types if specified.
         * @param message FriendAddProcessReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.FriendAddProcessReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FriendAddProcessReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FriendAddProcessReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FriendAddProcessRsp. */
    interface IFriendAddProcessRsp {

        /** FriendAddProcessRsp requestId */
        requestId?: (string|null);

        /** FriendAddProcessRsp success */
        success?: (boolean|null);

        /** FriendAddProcessRsp errmsg */
        errmsg?: (string|null);

        /** FriendAddProcessRsp newSessionId */
        newSessionId?: (string|null);
    }

    /** Represents a FriendAddProcessRsp. */
    class FriendAddProcessRsp implements IFriendAddProcessRsp {

        /**
         * Constructs a new FriendAddProcessRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IFriendAddProcessRsp);

        /** FriendAddProcessRsp requestId. */
        public requestId: string;

        /** FriendAddProcessRsp success. */
        public success: boolean;

        /** FriendAddProcessRsp errmsg. */
        public errmsg: string;

        /** FriendAddProcessRsp newSessionId. */
        public newSessionId?: (string|null);

        /**
         * Creates a new FriendAddProcessRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FriendAddProcessRsp instance
         */
        public static create(properties?: im_server.IFriendAddProcessRsp): im_server.FriendAddProcessRsp;

        /**
         * Encodes the specified FriendAddProcessRsp message. Does not implicitly {@link im_server.FriendAddProcessRsp.verify|verify} messages.
         * @param message FriendAddProcessRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IFriendAddProcessRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FriendAddProcessRsp message, length delimited. Does not implicitly {@link im_server.FriendAddProcessRsp.verify|verify} messages.
         * @param message FriendAddProcessRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IFriendAddProcessRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FriendAddProcessRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FriendAddProcessRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.FriendAddProcessRsp;

        /**
         * Decodes a FriendAddProcessRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FriendAddProcessRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.FriendAddProcessRsp;

        /**
         * Verifies a FriendAddProcessRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FriendAddProcessRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FriendAddProcessRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.FriendAddProcessRsp;

        /**
         * Creates a plain object from a FriendAddProcessRsp message. Also converts values to other types if specified.
         * @param message FriendAddProcessRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.FriendAddProcessRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FriendAddProcessRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FriendAddProcessRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetPendingFriendEventListReq. */
    interface IGetPendingFriendEventListReq {

        /** GetPendingFriendEventListReq requestId */
        requestId?: (string|null);

        /** GetPendingFriendEventListReq sessionId */
        sessionId?: (string|null);

        /** GetPendingFriendEventListReq userId */
        userId?: (string|null);
    }

    /** Represents a GetPendingFriendEventListReq. */
    class GetPendingFriendEventListReq implements IGetPendingFriendEventListReq {

        /**
         * Constructs a new GetPendingFriendEventListReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetPendingFriendEventListReq);

        /** GetPendingFriendEventListReq requestId. */
        public requestId: string;

        /** GetPendingFriendEventListReq sessionId. */
        public sessionId?: (string|null);

        /** GetPendingFriendEventListReq userId. */
        public userId?: (string|null);

        /**
         * Creates a new GetPendingFriendEventListReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetPendingFriendEventListReq instance
         */
        public static create(properties?: im_server.IGetPendingFriendEventListReq): im_server.GetPendingFriendEventListReq;

        /**
         * Encodes the specified GetPendingFriendEventListReq message. Does not implicitly {@link im_server.GetPendingFriendEventListReq.verify|verify} messages.
         * @param message GetPendingFriendEventListReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetPendingFriendEventListReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetPendingFriendEventListReq message, length delimited. Does not implicitly {@link im_server.GetPendingFriendEventListReq.verify|verify} messages.
         * @param message GetPendingFriendEventListReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetPendingFriendEventListReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetPendingFriendEventListReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetPendingFriendEventListReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetPendingFriendEventListReq;

        /**
         * Decodes a GetPendingFriendEventListReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetPendingFriendEventListReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetPendingFriendEventListReq;

        /**
         * Verifies a GetPendingFriendEventListReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetPendingFriendEventListReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetPendingFriendEventListReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetPendingFriendEventListReq;

        /**
         * Creates a plain object from a GetPendingFriendEventListReq message. Also converts values to other types if specified.
         * @param message GetPendingFriendEventListReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetPendingFriendEventListReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetPendingFriendEventListReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetPendingFriendEventListReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FriendEvent. */
    interface IFriendEvent {

        /** FriendEvent eventId */
        eventId?: (string|null);

        /** FriendEvent sender */
        sender?: (im_server.IUserInfo|null);
    }

    /** Represents a FriendEvent. */
    class FriendEvent implements IFriendEvent {

        /**
         * Constructs a new FriendEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IFriendEvent);

        /** FriendEvent eventId. */
        public eventId: string;

        /** FriendEvent sender. */
        public sender?: (im_server.IUserInfo|null);

        /**
         * Creates a new FriendEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FriendEvent instance
         */
        public static create(properties?: im_server.IFriendEvent): im_server.FriendEvent;

        /**
         * Encodes the specified FriendEvent message. Does not implicitly {@link im_server.FriendEvent.verify|verify} messages.
         * @param message FriendEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IFriendEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FriendEvent message, length delimited. Does not implicitly {@link im_server.FriendEvent.verify|verify} messages.
         * @param message FriendEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IFriendEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FriendEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FriendEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.FriendEvent;

        /**
         * Decodes a FriendEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FriendEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.FriendEvent;

        /**
         * Verifies a FriendEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FriendEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FriendEvent
         */
        public static fromObject(object: { [k: string]: any }): im_server.FriendEvent;

        /**
         * Creates a plain object from a FriendEvent message. Also converts values to other types if specified.
         * @param message FriendEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.FriendEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FriendEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FriendEvent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetPendingFriendEventListRsp. */
    interface IGetPendingFriendEventListRsp {

        /** GetPendingFriendEventListRsp requestId */
        requestId?: (string|null);

        /** GetPendingFriendEventListRsp success */
        success?: (boolean|null);

        /** GetPendingFriendEventListRsp errmsg */
        errmsg?: (string|null);

        /** GetPendingFriendEventListRsp event */
        event?: (im_server.IFriendEvent[]|null);
    }

    /** Represents a GetPendingFriendEventListRsp. */
    class GetPendingFriendEventListRsp implements IGetPendingFriendEventListRsp {

        /**
         * Constructs a new GetPendingFriendEventListRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetPendingFriendEventListRsp);

        /** GetPendingFriendEventListRsp requestId. */
        public requestId: string;

        /** GetPendingFriendEventListRsp success. */
        public success: boolean;

        /** GetPendingFriendEventListRsp errmsg. */
        public errmsg: string;

        /** GetPendingFriendEventListRsp event. */
        public event: im_server.IFriendEvent[];

        /**
         * Creates a new GetPendingFriendEventListRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetPendingFriendEventListRsp instance
         */
        public static create(properties?: im_server.IGetPendingFriendEventListRsp): im_server.GetPendingFriendEventListRsp;

        /**
         * Encodes the specified GetPendingFriendEventListRsp message. Does not implicitly {@link im_server.GetPendingFriendEventListRsp.verify|verify} messages.
         * @param message GetPendingFriendEventListRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetPendingFriendEventListRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetPendingFriendEventListRsp message, length delimited. Does not implicitly {@link im_server.GetPendingFriendEventListRsp.verify|verify} messages.
         * @param message GetPendingFriendEventListRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetPendingFriendEventListRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetPendingFriendEventListRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetPendingFriendEventListRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetPendingFriendEventListRsp;

        /**
         * Decodes a GetPendingFriendEventListRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetPendingFriendEventListRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetPendingFriendEventListRsp;

        /**
         * Verifies a GetPendingFriendEventListRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetPendingFriendEventListRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetPendingFriendEventListRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetPendingFriendEventListRsp;

        /**
         * Creates a plain object from a GetPendingFriendEventListRsp message. Also converts values to other types if specified.
         * @param message GetPendingFriendEventListRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetPendingFriendEventListRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetPendingFriendEventListRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetPendingFriendEventListRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FriendSearchReq. */
    interface IFriendSearchReq {

        /** FriendSearchReq requestId */
        requestId?: (string|null);

        /** FriendSearchReq searchKey */
        searchKey?: (string|null);

        /** FriendSearchReq sessionId */
        sessionId?: (string|null);

        /** FriendSearchReq userId */
        userId?: (string|null);
    }

    /** Represents a FriendSearchReq. */
    class FriendSearchReq implements IFriendSearchReq {

        /**
         * Constructs a new FriendSearchReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IFriendSearchReq);

        /** FriendSearchReq requestId. */
        public requestId: string;

        /** FriendSearchReq searchKey. */
        public searchKey: string;

        /** FriendSearchReq sessionId. */
        public sessionId?: (string|null);

        /** FriendSearchReq userId. */
        public userId?: (string|null);

        /**
         * Creates a new FriendSearchReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FriendSearchReq instance
         */
        public static create(properties?: im_server.IFriendSearchReq): im_server.FriendSearchReq;

        /**
         * Encodes the specified FriendSearchReq message. Does not implicitly {@link im_server.FriendSearchReq.verify|verify} messages.
         * @param message FriendSearchReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IFriendSearchReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FriendSearchReq message, length delimited. Does not implicitly {@link im_server.FriendSearchReq.verify|verify} messages.
         * @param message FriendSearchReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IFriendSearchReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FriendSearchReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FriendSearchReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.FriendSearchReq;

        /**
         * Decodes a FriendSearchReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FriendSearchReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.FriendSearchReq;

        /**
         * Verifies a FriendSearchReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FriendSearchReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FriendSearchReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.FriendSearchReq;

        /**
         * Creates a plain object from a FriendSearchReq message. Also converts values to other types if specified.
         * @param message FriendSearchReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.FriendSearchReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FriendSearchReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FriendSearchReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FriendSearchRsp. */
    interface IFriendSearchRsp {

        /** FriendSearchRsp requestId */
        requestId?: (string|null);

        /** FriendSearchRsp success */
        success?: (boolean|null);

        /** FriendSearchRsp errmsg */
        errmsg?: (string|null);

        /** FriendSearchRsp userInfo */
        userInfo?: (im_server.IUserInfo[]|null);
    }

    /** Represents a FriendSearchRsp. */
    class FriendSearchRsp implements IFriendSearchRsp {

        /**
         * Constructs a new FriendSearchRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IFriendSearchRsp);

        /** FriendSearchRsp requestId. */
        public requestId: string;

        /** FriendSearchRsp success. */
        public success: boolean;

        /** FriendSearchRsp errmsg. */
        public errmsg: string;

        /** FriendSearchRsp userInfo. */
        public userInfo: im_server.IUserInfo[];

        /**
         * Creates a new FriendSearchRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FriendSearchRsp instance
         */
        public static create(properties?: im_server.IFriendSearchRsp): im_server.FriendSearchRsp;

        /**
         * Encodes the specified FriendSearchRsp message. Does not implicitly {@link im_server.FriendSearchRsp.verify|verify} messages.
         * @param message FriendSearchRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IFriendSearchRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FriendSearchRsp message, length delimited. Does not implicitly {@link im_server.FriendSearchRsp.verify|verify} messages.
         * @param message FriendSearchRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IFriendSearchRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FriendSearchRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FriendSearchRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.FriendSearchRsp;

        /**
         * Decodes a FriendSearchRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FriendSearchRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.FriendSearchRsp;

        /**
         * Verifies a FriendSearchRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FriendSearchRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FriendSearchRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.FriendSearchRsp;

        /**
         * Creates a plain object from a FriendSearchRsp message. Also converts values to other types if specified.
         * @param message FriendSearchRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.FriendSearchRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FriendSearchRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FriendSearchRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetChatSessionListReq. */
    interface IGetChatSessionListReq {

        /** GetChatSessionListReq requestId */
        requestId?: (string|null);

        /** GetChatSessionListReq sessionId */
        sessionId?: (string|null);

        /** GetChatSessionListReq userId */
        userId?: (string|null);
    }

    /** Represents a GetChatSessionListReq. */
    class GetChatSessionListReq implements IGetChatSessionListReq {

        /**
         * Constructs a new GetChatSessionListReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetChatSessionListReq);

        /** GetChatSessionListReq requestId. */
        public requestId: string;

        /** GetChatSessionListReq sessionId. */
        public sessionId?: (string|null);

        /** GetChatSessionListReq userId. */
        public userId?: (string|null);

        /**
         * Creates a new GetChatSessionListReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetChatSessionListReq instance
         */
        public static create(properties?: im_server.IGetChatSessionListReq): im_server.GetChatSessionListReq;

        /**
         * Encodes the specified GetChatSessionListReq message. Does not implicitly {@link im_server.GetChatSessionListReq.verify|verify} messages.
         * @param message GetChatSessionListReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetChatSessionListReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetChatSessionListReq message, length delimited. Does not implicitly {@link im_server.GetChatSessionListReq.verify|verify} messages.
         * @param message GetChatSessionListReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetChatSessionListReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetChatSessionListReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetChatSessionListReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetChatSessionListReq;

        /**
         * Decodes a GetChatSessionListReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetChatSessionListReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetChatSessionListReq;

        /**
         * Verifies a GetChatSessionListReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetChatSessionListReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetChatSessionListReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetChatSessionListReq;

        /**
         * Creates a plain object from a GetChatSessionListReq message. Also converts values to other types if specified.
         * @param message GetChatSessionListReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetChatSessionListReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetChatSessionListReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetChatSessionListReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetChatSessionListRsp. */
    interface IGetChatSessionListRsp {

        /** GetChatSessionListRsp requestId */
        requestId?: (string|null);

        /** GetChatSessionListRsp success */
        success?: (boolean|null);

        /** GetChatSessionListRsp errmsg */
        errmsg?: (string|null);

        /** GetChatSessionListRsp chatSessionInfoList */
        chatSessionInfoList?: (im_server.IChatSessionInfo[]|null);
    }

    /** Represents a GetChatSessionListRsp. */
    class GetChatSessionListRsp implements IGetChatSessionListRsp {

        /**
         * Constructs a new GetChatSessionListRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetChatSessionListRsp);

        /** GetChatSessionListRsp requestId. */
        public requestId: string;

        /** GetChatSessionListRsp success. */
        public success: boolean;

        /** GetChatSessionListRsp errmsg. */
        public errmsg: string;

        /** GetChatSessionListRsp chatSessionInfoList. */
        public chatSessionInfoList: im_server.IChatSessionInfo[];

        /**
         * Creates a new GetChatSessionListRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetChatSessionListRsp instance
         */
        public static create(properties?: im_server.IGetChatSessionListRsp): im_server.GetChatSessionListRsp;

        /**
         * Encodes the specified GetChatSessionListRsp message. Does not implicitly {@link im_server.GetChatSessionListRsp.verify|verify} messages.
         * @param message GetChatSessionListRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetChatSessionListRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetChatSessionListRsp message, length delimited. Does not implicitly {@link im_server.GetChatSessionListRsp.verify|verify} messages.
         * @param message GetChatSessionListRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetChatSessionListRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetChatSessionListRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetChatSessionListRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetChatSessionListRsp;

        /**
         * Decodes a GetChatSessionListRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetChatSessionListRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetChatSessionListRsp;

        /**
         * Verifies a GetChatSessionListRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetChatSessionListRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetChatSessionListRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetChatSessionListRsp;

        /**
         * Creates a plain object from a GetChatSessionListRsp message. Also converts values to other types if specified.
         * @param message GetChatSessionListRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetChatSessionListRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetChatSessionListRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetChatSessionListRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ChatSessionCreateReq. */
    interface IChatSessionCreateReq {

        /** ChatSessionCreateReq requestId */
        requestId?: (string|null);

        /** ChatSessionCreateReq sessionId */
        sessionId?: (string|null);

        /** ChatSessionCreateReq userId */
        userId?: (string|null);

        /** ChatSessionCreateReq chatSessionName */
        chatSessionName?: (string|null);

        /** ChatSessionCreateReq memberIdList */
        memberIdList?: (string[]|null);
    }

    /** Represents a ChatSessionCreateReq. */
    class ChatSessionCreateReq implements IChatSessionCreateReq {

        /**
         * Constructs a new ChatSessionCreateReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IChatSessionCreateReq);

        /** ChatSessionCreateReq requestId. */
        public requestId: string;

        /** ChatSessionCreateReq sessionId. */
        public sessionId?: (string|null);

        /** ChatSessionCreateReq userId. */
        public userId?: (string|null);

        /** ChatSessionCreateReq chatSessionName. */
        public chatSessionName: string;

        /** ChatSessionCreateReq memberIdList. */
        public memberIdList: string[];

        /**
         * Creates a new ChatSessionCreateReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatSessionCreateReq instance
         */
        public static create(properties?: im_server.IChatSessionCreateReq): im_server.ChatSessionCreateReq;

        /**
         * Encodes the specified ChatSessionCreateReq message. Does not implicitly {@link im_server.ChatSessionCreateReq.verify|verify} messages.
         * @param message ChatSessionCreateReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IChatSessionCreateReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChatSessionCreateReq message, length delimited. Does not implicitly {@link im_server.ChatSessionCreateReq.verify|verify} messages.
         * @param message ChatSessionCreateReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IChatSessionCreateReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatSessionCreateReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatSessionCreateReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.ChatSessionCreateReq;

        /**
         * Decodes a ChatSessionCreateReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChatSessionCreateReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.ChatSessionCreateReq;

        /**
         * Verifies a ChatSessionCreateReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChatSessionCreateReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChatSessionCreateReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.ChatSessionCreateReq;

        /**
         * Creates a plain object from a ChatSessionCreateReq message. Also converts values to other types if specified.
         * @param message ChatSessionCreateReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.ChatSessionCreateReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChatSessionCreateReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ChatSessionCreateReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ChatSessionCreateRsp. */
    interface IChatSessionCreateRsp {

        /** ChatSessionCreateRsp requestId */
        requestId?: (string|null);

        /** ChatSessionCreateRsp success */
        success?: (boolean|null);

        /** ChatSessionCreateRsp errmsg */
        errmsg?: (string|null);

        /** ChatSessionCreateRsp chatSessionInfo */
        chatSessionInfo?: (im_server.IChatSessionInfo|null);
    }

    /** Represents a ChatSessionCreateRsp. */
    class ChatSessionCreateRsp implements IChatSessionCreateRsp {

        /**
         * Constructs a new ChatSessionCreateRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IChatSessionCreateRsp);

        /** ChatSessionCreateRsp requestId. */
        public requestId: string;

        /** ChatSessionCreateRsp success. */
        public success: boolean;

        /** ChatSessionCreateRsp errmsg. */
        public errmsg: string;

        /** ChatSessionCreateRsp chatSessionInfo. */
        public chatSessionInfo?: (im_server.IChatSessionInfo|null);

        /**
         * Creates a new ChatSessionCreateRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatSessionCreateRsp instance
         */
        public static create(properties?: im_server.IChatSessionCreateRsp): im_server.ChatSessionCreateRsp;

        /**
         * Encodes the specified ChatSessionCreateRsp message. Does not implicitly {@link im_server.ChatSessionCreateRsp.verify|verify} messages.
         * @param message ChatSessionCreateRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IChatSessionCreateRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChatSessionCreateRsp message, length delimited. Does not implicitly {@link im_server.ChatSessionCreateRsp.verify|verify} messages.
         * @param message ChatSessionCreateRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IChatSessionCreateRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatSessionCreateRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatSessionCreateRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.ChatSessionCreateRsp;

        /**
         * Decodes a ChatSessionCreateRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChatSessionCreateRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.ChatSessionCreateRsp;

        /**
         * Verifies a ChatSessionCreateRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChatSessionCreateRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChatSessionCreateRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.ChatSessionCreateRsp;

        /**
         * Creates a plain object from a ChatSessionCreateRsp message. Also converts values to other types if specified.
         * @param message ChatSessionCreateRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.ChatSessionCreateRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChatSessionCreateRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ChatSessionCreateRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetChatSessionMemberReq. */
    interface IGetChatSessionMemberReq {

        /** GetChatSessionMemberReq requestId */
        requestId?: (string|null);

        /** GetChatSessionMemberReq sessionId */
        sessionId?: (string|null);

        /** GetChatSessionMemberReq userId */
        userId?: (string|null);

        /** GetChatSessionMemberReq chatSessionId */
        chatSessionId?: (string|null);
    }

    /** Represents a GetChatSessionMemberReq. */
    class GetChatSessionMemberReq implements IGetChatSessionMemberReq {

        /**
         * Constructs a new GetChatSessionMemberReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetChatSessionMemberReq);

        /** GetChatSessionMemberReq requestId. */
        public requestId: string;

        /** GetChatSessionMemberReq sessionId. */
        public sessionId?: (string|null);

        /** GetChatSessionMemberReq userId. */
        public userId?: (string|null);

        /** GetChatSessionMemberReq chatSessionId. */
        public chatSessionId: string;

        /**
         * Creates a new GetChatSessionMemberReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetChatSessionMemberReq instance
         */
        public static create(properties?: im_server.IGetChatSessionMemberReq): im_server.GetChatSessionMemberReq;

        /**
         * Encodes the specified GetChatSessionMemberReq message. Does not implicitly {@link im_server.GetChatSessionMemberReq.verify|verify} messages.
         * @param message GetChatSessionMemberReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetChatSessionMemberReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetChatSessionMemberReq message, length delimited. Does not implicitly {@link im_server.GetChatSessionMemberReq.verify|verify} messages.
         * @param message GetChatSessionMemberReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetChatSessionMemberReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetChatSessionMemberReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetChatSessionMemberReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetChatSessionMemberReq;

        /**
         * Decodes a GetChatSessionMemberReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetChatSessionMemberReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetChatSessionMemberReq;

        /**
         * Verifies a GetChatSessionMemberReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetChatSessionMemberReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetChatSessionMemberReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetChatSessionMemberReq;

        /**
         * Creates a plain object from a GetChatSessionMemberReq message. Also converts values to other types if specified.
         * @param message GetChatSessionMemberReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetChatSessionMemberReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetChatSessionMemberReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetChatSessionMemberReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetChatSessionMemberRsp. */
    interface IGetChatSessionMemberRsp {

        /** GetChatSessionMemberRsp requestId */
        requestId?: (string|null);

        /** GetChatSessionMemberRsp success */
        success?: (boolean|null);

        /** GetChatSessionMemberRsp errmsg */
        errmsg?: (string|null);

        /** GetChatSessionMemberRsp memberInfoList */
        memberInfoList?: (im_server.IUserInfo[]|null);
    }

    /** Represents a GetChatSessionMemberRsp. */
    class GetChatSessionMemberRsp implements IGetChatSessionMemberRsp {

        /**
         * Constructs a new GetChatSessionMemberRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetChatSessionMemberRsp);

        /** GetChatSessionMemberRsp requestId. */
        public requestId: string;

        /** GetChatSessionMemberRsp success. */
        public success: boolean;

        /** GetChatSessionMemberRsp errmsg. */
        public errmsg: string;

        /** GetChatSessionMemberRsp memberInfoList. */
        public memberInfoList: im_server.IUserInfo[];

        /**
         * Creates a new GetChatSessionMemberRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetChatSessionMemberRsp instance
         */
        public static create(properties?: im_server.IGetChatSessionMemberRsp): im_server.GetChatSessionMemberRsp;

        /**
         * Encodes the specified GetChatSessionMemberRsp message. Does not implicitly {@link im_server.GetChatSessionMemberRsp.verify|verify} messages.
         * @param message GetChatSessionMemberRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetChatSessionMemberRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetChatSessionMemberRsp message, length delimited. Does not implicitly {@link im_server.GetChatSessionMemberRsp.verify|verify} messages.
         * @param message GetChatSessionMemberRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetChatSessionMemberRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetChatSessionMemberRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetChatSessionMemberRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetChatSessionMemberRsp;

        /**
         * Decodes a GetChatSessionMemberRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetChatSessionMemberRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetChatSessionMemberRsp;

        /**
         * Verifies a GetChatSessionMemberRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetChatSessionMemberRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetChatSessionMemberRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetChatSessionMemberRsp;

        /**
         * Creates a plain object from a GetChatSessionMemberRsp message. Also converts values to other types if specified.
         * @param message GetChatSessionMemberRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetChatSessionMemberRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetChatSessionMemberRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetChatSessionMemberRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Represents a FriendService */
    class FriendService extends $protobuf.rpc.Service {

        /**
         * Constructs a new FriendService service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new FriendService service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): FriendService;

        /**
         * Calls GetFriendList.
         * @param request GetFriendListReq message or plain object
         * @param callback Node-style callback called with the error, if any, and GetFriendListRsp
         */
        public getFriendList(request: im_server.IGetFriendListReq, callback: im_server.FriendService.GetFriendListCallback): void;

        /**
         * Calls GetFriendList.
         * @param request GetFriendListReq message or plain object
         * @returns Promise
         */
        public getFriendList(request: im_server.IGetFriendListReq): Promise<im_server.GetFriendListRsp>;

        /**
         * Calls FriendRemove.
         * @param request FriendRemoveReq message or plain object
         * @param callback Node-style callback called with the error, if any, and FriendRemoveRsp
         */
        public friendRemove(request: im_server.IFriendRemoveReq, callback: im_server.FriendService.FriendRemoveCallback): void;

        /**
         * Calls FriendRemove.
         * @param request FriendRemoveReq message or plain object
         * @returns Promise
         */
        public friendRemove(request: im_server.IFriendRemoveReq): Promise<im_server.FriendRemoveRsp>;

        /**
         * Calls FriendAdd.
         * @param request FriendAddReq message or plain object
         * @param callback Node-style callback called with the error, if any, and FriendAddRsp
         */
        public friendAdd(request: im_server.IFriendAddReq, callback: im_server.FriendService.FriendAddCallback): void;

        /**
         * Calls FriendAdd.
         * @param request FriendAddReq message or plain object
         * @returns Promise
         */
        public friendAdd(request: im_server.IFriendAddReq): Promise<im_server.FriendAddRsp>;

        /**
         * Calls FriendAddProcess.
         * @param request FriendAddProcessReq message or plain object
         * @param callback Node-style callback called with the error, if any, and FriendAddProcessRsp
         */
        public friendAddProcess(request: im_server.IFriendAddProcessReq, callback: im_server.FriendService.FriendAddProcessCallback): void;

        /**
         * Calls FriendAddProcess.
         * @param request FriendAddProcessReq message or plain object
         * @returns Promise
         */
        public friendAddProcess(request: im_server.IFriendAddProcessReq): Promise<im_server.FriendAddProcessRsp>;

        /**
         * Calls FriendSearch.
         * @param request FriendSearchReq message or plain object
         * @param callback Node-style callback called with the error, if any, and FriendSearchRsp
         */
        public friendSearch(request: im_server.IFriendSearchReq, callback: im_server.FriendService.FriendSearchCallback): void;

        /**
         * Calls FriendSearch.
         * @param request FriendSearchReq message or plain object
         * @returns Promise
         */
        public friendSearch(request: im_server.IFriendSearchReq): Promise<im_server.FriendSearchRsp>;

        /**
         * Calls GetChatSessionList.
         * @param request GetChatSessionListReq message or plain object
         * @param callback Node-style callback called with the error, if any, and GetChatSessionListRsp
         */
        public getChatSessionList(request: im_server.IGetChatSessionListReq, callback: im_server.FriendService.GetChatSessionListCallback): void;

        /**
         * Calls GetChatSessionList.
         * @param request GetChatSessionListReq message or plain object
         * @returns Promise
         */
        public getChatSessionList(request: im_server.IGetChatSessionListReq): Promise<im_server.GetChatSessionListRsp>;

        /**
         * Calls ChatSessionCreate.
         * @param request ChatSessionCreateReq message or plain object
         * @param callback Node-style callback called with the error, if any, and ChatSessionCreateRsp
         */
        public chatSessionCreate(request: im_server.IChatSessionCreateReq, callback: im_server.FriendService.ChatSessionCreateCallback): void;

        /**
         * Calls ChatSessionCreate.
         * @param request ChatSessionCreateReq message or plain object
         * @returns Promise
         */
        public chatSessionCreate(request: im_server.IChatSessionCreateReq): Promise<im_server.ChatSessionCreateRsp>;

        /**
         * Calls GetChatSessionMember.
         * @param request GetChatSessionMemberReq message or plain object
         * @param callback Node-style callback called with the error, if any, and GetChatSessionMemberRsp
         */
        public getChatSessionMember(request: im_server.IGetChatSessionMemberReq, callback: im_server.FriendService.GetChatSessionMemberCallback): void;

        /**
         * Calls GetChatSessionMember.
         * @param request GetChatSessionMemberReq message or plain object
         * @returns Promise
         */
        public getChatSessionMember(request: im_server.IGetChatSessionMemberReq): Promise<im_server.GetChatSessionMemberRsp>;

        /**
         * Calls GetPendingFriendEventList.
         * @param request GetPendingFriendEventListReq message or plain object
         * @param callback Node-style callback called with the error, if any, and GetPendingFriendEventListRsp
         */
        public getPendingFriendEventList(request: im_server.IGetPendingFriendEventListReq, callback: im_server.FriendService.GetPendingFriendEventListCallback): void;

        /**
         * Calls GetPendingFriendEventList.
         * @param request GetPendingFriendEventListReq message or plain object
         * @returns Promise
         */
        public getPendingFriendEventList(request: im_server.IGetPendingFriendEventListReq): Promise<im_server.GetPendingFriendEventListRsp>;
    }

    namespace FriendService {

        /**
         * Callback as used by {@link im_server.FriendService#getFriendList}.
         * @param error Error, if any
         * @param [response] GetFriendListRsp
         */
        type GetFriendListCallback = (error: (Error|null), response?: im_server.GetFriendListRsp) => void;

        /**
         * Callback as used by {@link im_server.FriendService#friendRemove}.
         * @param error Error, if any
         * @param [response] FriendRemoveRsp
         */
        type FriendRemoveCallback = (error: (Error|null), response?: im_server.FriendRemoveRsp) => void;

        /**
         * Callback as used by {@link im_server.FriendService#friendAdd}.
         * @param error Error, if any
         * @param [response] FriendAddRsp
         */
        type FriendAddCallback = (error: (Error|null), response?: im_server.FriendAddRsp) => void;

        /**
         * Callback as used by {@link im_server.FriendService#friendAddProcess}.
         * @param error Error, if any
         * @param [response] FriendAddProcessRsp
         */
        type FriendAddProcessCallback = (error: (Error|null), response?: im_server.FriendAddProcessRsp) => void;

        /**
         * Callback as used by {@link im_server.FriendService#friendSearch}.
         * @param error Error, if any
         * @param [response] FriendSearchRsp
         */
        type FriendSearchCallback = (error: (Error|null), response?: im_server.FriendSearchRsp) => void;

        /**
         * Callback as used by {@link im_server.FriendService#getChatSessionList}.
         * @param error Error, if any
         * @param [response] GetChatSessionListRsp
         */
        type GetChatSessionListCallback = (error: (Error|null), response?: im_server.GetChatSessionListRsp) => void;

        /**
         * Callback as used by {@link im_server.FriendService#chatSessionCreate}.
         * @param error Error, if any
         * @param [response] ChatSessionCreateRsp
         */
        type ChatSessionCreateCallback = (error: (Error|null), response?: im_server.ChatSessionCreateRsp) => void;

        /**
         * Callback as used by {@link im_server.FriendService#getChatSessionMember}.
         * @param error Error, if any
         * @param [response] GetChatSessionMemberRsp
         */
        type GetChatSessionMemberCallback = (error: (Error|null), response?: im_server.GetChatSessionMemberRsp) => void;

        /**
         * Callback as used by {@link im_server.FriendService#getPendingFriendEventList}.
         * @param error Error, if any
         * @param [response] GetPendingFriendEventListRsp
         */
        type GetPendingFriendEventListCallback = (error: (Error|null), response?: im_server.GetPendingFriendEventListRsp) => void;
    }

    /** Properties of a ClientAuthenticationReq. */
    interface IClientAuthenticationReq {

        /** ClientAuthenticationReq requestId */
        requestId?: (string|null);

        /** ClientAuthenticationReq sessionId */
        sessionId?: (string|null);
    }

    /** Represents a ClientAuthenticationReq. */
    class ClientAuthenticationReq implements IClientAuthenticationReq {

        /**
         * Constructs a new ClientAuthenticationReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IClientAuthenticationReq);

        /** ClientAuthenticationReq requestId. */
        public requestId: string;

        /** ClientAuthenticationReq sessionId. */
        public sessionId: string;

        /**
         * Creates a new ClientAuthenticationReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ClientAuthenticationReq instance
         */
        public static create(properties?: im_server.IClientAuthenticationReq): im_server.ClientAuthenticationReq;

        /**
         * Encodes the specified ClientAuthenticationReq message. Does not implicitly {@link im_server.ClientAuthenticationReq.verify|verify} messages.
         * @param message ClientAuthenticationReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IClientAuthenticationReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ClientAuthenticationReq message, length delimited. Does not implicitly {@link im_server.ClientAuthenticationReq.verify|verify} messages.
         * @param message ClientAuthenticationReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IClientAuthenticationReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ClientAuthenticationReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ClientAuthenticationReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.ClientAuthenticationReq;

        /**
         * Decodes a ClientAuthenticationReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ClientAuthenticationReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.ClientAuthenticationReq;

        /**
         * Verifies a ClientAuthenticationReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ClientAuthenticationReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ClientAuthenticationReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.ClientAuthenticationReq;

        /**
         * Creates a plain object from a ClientAuthenticationReq message. Also converts values to other types if specified.
         * @param message ClientAuthenticationReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.ClientAuthenticationReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ClientAuthenticationReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ClientAuthenticationReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetHistoryMsgReq. */
    interface IGetHistoryMsgReq {

        /** GetHistoryMsgReq requestId */
        requestId?: (string|null);

        /** GetHistoryMsgReq chatSessionId */
        chatSessionId?: (string|null);

        /** GetHistoryMsgReq startTime */
        startTime?: (number|Long|null);

        /** GetHistoryMsgReq overTime */
        overTime?: (number|Long|null);

        /** GetHistoryMsgReq userId */
        userId?: (string|null);

        /** GetHistoryMsgReq sessionId */
        sessionId?: (string|null);
    }

    /** Represents a GetHistoryMsgReq. */
    class GetHistoryMsgReq implements IGetHistoryMsgReq {

        /**
         * Constructs a new GetHistoryMsgReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetHistoryMsgReq);

        /** GetHistoryMsgReq requestId. */
        public requestId: string;

        /** GetHistoryMsgReq chatSessionId. */
        public chatSessionId: string;

        /** GetHistoryMsgReq startTime. */
        public startTime: (number|Long);

        /** GetHistoryMsgReq overTime. */
        public overTime: (number|Long);

        /** GetHistoryMsgReq userId. */
        public userId?: (string|null);

        /** GetHistoryMsgReq sessionId. */
        public sessionId?: (string|null);

        /**
         * Creates a new GetHistoryMsgReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetHistoryMsgReq instance
         */
        public static create(properties?: im_server.IGetHistoryMsgReq): im_server.GetHistoryMsgReq;

        /**
         * Encodes the specified GetHistoryMsgReq message. Does not implicitly {@link im_server.GetHistoryMsgReq.verify|verify} messages.
         * @param message GetHistoryMsgReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetHistoryMsgReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetHistoryMsgReq message, length delimited. Does not implicitly {@link im_server.GetHistoryMsgReq.verify|verify} messages.
         * @param message GetHistoryMsgReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetHistoryMsgReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetHistoryMsgReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetHistoryMsgReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetHistoryMsgReq;

        /**
         * Decodes a GetHistoryMsgReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetHistoryMsgReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetHistoryMsgReq;

        /**
         * Verifies a GetHistoryMsgReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetHistoryMsgReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetHistoryMsgReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetHistoryMsgReq;

        /**
         * Creates a plain object from a GetHistoryMsgReq message. Also converts values to other types if specified.
         * @param message GetHistoryMsgReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetHistoryMsgReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetHistoryMsgReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetHistoryMsgReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetHistoryMsgRsp. */
    interface IGetHistoryMsgRsp {

        /** GetHistoryMsgRsp requestId */
        requestId?: (string|null);

        /** GetHistoryMsgRsp success */
        success?: (boolean|null);

        /** GetHistoryMsgRsp errmsg */
        errmsg?: (string|null);

        /** GetHistoryMsgRsp msgList */
        msgList?: (im_server.IMessageInfo[]|null);
    }

    /** Represents a GetHistoryMsgRsp. */
    class GetHistoryMsgRsp implements IGetHistoryMsgRsp {

        /**
         * Constructs a new GetHistoryMsgRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetHistoryMsgRsp);

        /** GetHistoryMsgRsp requestId. */
        public requestId: string;

        /** GetHistoryMsgRsp success. */
        public success: boolean;

        /** GetHistoryMsgRsp errmsg. */
        public errmsg: string;

        /** GetHistoryMsgRsp msgList. */
        public msgList: im_server.IMessageInfo[];

        /**
         * Creates a new GetHistoryMsgRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetHistoryMsgRsp instance
         */
        public static create(properties?: im_server.IGetHistoryMsgRsp): im_server.GetHistoryMsgRsp;

        /**
         * Encodes the specified GetHistoryMsgRsp message. Does not implicitly {@link im_server.GetHistoryMsgRsp.verify|verify} messages.
         * @param message GetHistoryMsgRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetHistoryMsgRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetHistoryMsgRsp message, length delimited. Does not implicitly {@link im_server.GetHistoryMsgRsp.verify|verify} messages.
         * @param message GetHistoryMsgRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetHistoryMsgRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetHistoryMsgRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetHistoryMsgRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetHistoryMsgRsp;

        /**
         * Decodes a GetHistoryMsgRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetHistoryMsgRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetHistoryMsgRsp;

        /**
         * Verifies a GetHistoryMsgRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetHistoryMsgRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetHistoryMsgRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetHistoryMsgRsp;

        /**
         * Creates a plain object from a GetHistoryMsgRsp message. Also converts values to other types if specified.
         * @param message GetHistoryMsgRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetHistoryMsgRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetHistoryMsgRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetHistoryMsgRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetRecentMsgReq. */
    interface IGetRecentMsgReq {

        /** GetRecentMsgReq requestId */
        requestId?: (string|null);

        /** GetRecentMsgReq chatSessionId */
        chatSessionId?: (string|null);

        /** GetRecentMsgReq msgCount */
        msgCount?: (number|Long|null);

        /** GetRecentMsgReq curTime */
        curTime?: (number|Long|null);

        /** GetRecentMsgReq userId */
        userId?: (string|null);

        /** GetRecentMsgReq sessionId */
        sessionId?: (string|null);
    }

    /** Represents a GetRecentMsgReq. */
    class GetRecentMsgReq implements IGetRecentMsgReq {

        /**
         * Constructs a new GetRecentMsgReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetRecentMsgReq);

        /** GetRecentMsgReq requestId. */
        public requestId: string;

        /** GetRecentMsgReq chatSessionId. */
        public chatSessionId: string;

        /** GetRecentMsgReq msgCount. */
        public msgCount: (number|Long);

        /** GetRecentMsgReq curTime. */
        public curTime?: (number|Long|null);

        /** GetRecentMsgReq userId. */
        public userId?: (string|null);

        /** GetRecentMsgReq sessionId. */
        public sessionId?: (string|null);

        /**
         * Creates a new GetRecentMsgReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetRecentMsgReq instance
         */
        public static create(properties?: im_server.IGetRecentMsgReq): im_server.GetRecentMsgReq;

        /**
         * Encodes the specified GetRecentMsgReq message. Does not implicitly {@link im_server.GetRecentMsgReq.verify|verify} messages.
         * @param message GetRecentMsgReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetRecentMsgReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetRecentMsgReq message, length delimited. Does not implicitly {@link im_server.GetRecentMsgReq.verify|verify} messages.
         * @param message GetRecentMsgReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetRecentMsgReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetRecentMsgReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetRecentMsgReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetRecentMsgReq;

        /**
         * Decodes a GetRecentMsgReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetRecentMsgReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetRecentMsgReq;

        /**
         * Verifies a GetRecentMsgReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetRecentMsgReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetRecentMsgReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetRecentMsgReq;

        /**
         * Creates a plain object from a GetRecentMsgReq message. Also converts values to other types if specified.
         * @param message GetRecentMsgReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetRecentMsgReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetRecentMsgReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetRecentMsgReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetRecentMsgRsp. */
    interface IGetRecentMsgRsp {

        /** GetRecentMsgRsp requestId */
        requestId?: (string|null);

        /** GetRecentMsgRsp success */
        success?: (boolean|null);

        /** GetRecentMsgRsp errmsg */
        errmsg?: (string|null);

        /** GetRecentMsgRsp msgList */
        msgList?: (im_server.IMessageInfo[]|null);
    }

    /** Represents a GetRecentMsgRsp. */
    class GetRecentMsgRsp implements IGetRecentMsgRsp {

        /**
         * Constructs a new GetRecentMsgRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetRecentMsgRsp);

        /** GetRecentMsgRsp requestId. */
        public requestId: string;

        /** GetRecentMsgRsp success. */
        public success: boolean;

        /** GetRecentMsgRsp errmsg. */
        public errmsg: string;

        /** GetRecentMsgRsp msgList. */
        public msgList: im_server.IMessageInfo[];

        /**
         * Creates a new GetRecentMsgRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetRecentMsgRsp instance
         */
        public static create(properties?: im_server.IGetRecentMsgRsp): im_server.GetRecentMsgRsp;

        /**
         * Encodes the specified GetRecentMsgRsp message. Does not implicitly {@link im_server.GetRecentMsgRsp.verify|verify} messages.
         * @param message GetRecentMsgRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetRecentMsgRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetRecentMsgRsp message, length delimited. Does not implicitly {@link im_server.GetRecentMsgRsp.verify|verify} messages.
         * @param message GetRecentMsgRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetRecentMsgRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetRecentMsgRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetRecentMsgRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetRecentMsgRsp;

        /**
         * Decodes a GetRecentMsgRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetRecentMsgRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetRecentMsgRsp;

        /**
         * Verifies a GetRecentMsgRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetRecentMsgRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetRecentMsgRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetRecentMsgRsp;

        /**
         * Creates a plain object from a GetRecentMsgRsp message. Also converts values to other types if specified.
         * @param message GetRecentMsgRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetRecentMsgRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetRecentMsgRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetRecentMsgRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MsgSearchReq. */
    interface IMsgSearchReq {

        /** MsgSearchReq requestId */
        requestId?: (string|null);

        /** MsgSearchReq userId */
        userId?: (string|null);

        /** MsgSearchReq sessionId */
        sessionId?: (string|null);

        /** MsgSearchReq chatSessionId */
        chatSessionId?: (string|null);

        /** MsgSearchReq searchKey */
        searchKey?: (string|null);
    }

    /** Represents a MsgSearchReq. */
    class MsgSearchReq implements IMsgSearchReq {

        /**
         * Constructs a new MsgSearchReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IMsgSearchReq);

        /** MsgSearchReq requestId. */
        public requestId: string;

        /** MsgSearchReq userId. */
        public userId?: (string|null);

        /** MsgSearchReq sessionId. */
        public sessionId?: (string|null);

        /** MsgSearchReq chatSessionId. */
        public chatSessionId: string;

        /** MsgSearchReq searchKey. */
        public searchKey: string;

        /**
         * Creates a new MsgSearchReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MsgSearchReq instance
         */
        public static create(properties?: im_server.IMsgSearchReq): im_server.MsgSearchReq;

        /**
         * Encodes the specified MsgSearchReq message. Does not implicitly {@link im_server.MsgSearchReq.verify|verify} messages.
         * @param message MsgSearchReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IMsgSearchReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MsgSearchReq message, length delimited. Does not implicitly {@link im_server.MsgSearchReq.verify|verify} messages.
         * @param message MsgSearchReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IMsgSearchReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MsgSearchReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MsgSearchReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.MsgSearchReq;

        /**
         * Decodes a MsgSearchReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MsgSearchReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.MsgSearchReq;

        /**
         * Verifies a MsgSearchReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MsgSearchReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MsgSearchReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.MsgSearchReq;

        /**
         * Creates a plain object from a MsgSearchReq message. Also converts values to other types if specified.
         * @param message MsgSearchReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.MsgSearchReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MsgSearchReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MsgSearchReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MsgSearchRsp. */
    interface IMsgSearchRsp {

        /** MsgSearchRsp requestId */
        requestId?: (string|null);

        /** MsgSearchRsp success */
        success?: (boolean|null);

        /** MsgSearchRsp errmsg */
        errmsg?: (string|null);

        /** MsgSearchRsp msgList */
        msgList?: (im_server.IMessageInfo[]|null);
    }

    /** Represents a MsgSearchRsp. */
    class MsgSearchRsp implements IMsgSearchRsp {

        /**
         * Constructs a new MsgSearchRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IMsgSearchRsp);

        /** MsgSearchRsp requestId. */
        public requestId: string;

        /** MsgSearchRsp success. */
        public success: boolean;

        /** MsgSearchRsp errmsg. */
        public errmsg: string;

        /** MsgSearchRsp msgList. */
        public msgList: im_server.IMessageInfo[];

        /**
         * Creates a new MsgSearchRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MsgSearchRsp instance
         */
        public static create(properties?: im_server.IMsgSearchRsp): im_server.MsgSearchRsp;

        /**
         * Encodes the specified MsgSearchRsp message. Does not implicitly {@link im_server.MsgSearchRsp.verify|verify} messages.
         * @param message MsgSearchRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IMsgSearchRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MsgSearchRsp message, length delimited. Does not implicitly {@link im_server.MsgSearchRsp.verify|verify} messages.
         * @param message MsgSearchRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IMsgSearchRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MsgSearchRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MsgSearchRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.MsgSearchRsp;

        /**
         * Decodes a MsgSearchRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MsgSearchRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.MsgSearchRsp;

        /**
         * Verifies a MsgSearchRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MsgSearchRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MsgSearchRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.MsgSearchRsp;

        /**
         * Creates a plain object from a MsgSearchRsp message. Also converts values to other types if specified.
         * @param message MsgSearchRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.MsgSearchRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MsgSearchRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MsgSearchRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Represents a MsgStorageService */
    class MsgStorageService extends $protobuf.rpc.Service {

        /**
         * Constructs a new MsgStorageService service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new MsgStorageService service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): MsgStorageService;

        /**
         * Calls GetHistoryMsg.
         * @param request GetHistoryMsgReq message or plain object
         * @param callback Node-style callback called with the error, if any, and GetHistoryMsgRsp
         */
        public getHistoryMsg(request: im_server.IGetHistoryMsgReq, callback: im_server.MsgStorageService.GetHistoryMsgCallback): void;

        /**
         * Calls GetHistoryMsg.
         * @param request GetHistoryMsgReq message or plain object
         * @returns Promise
         */
        public getHistoryMsg(request: im_server.IGetHistoryMsgReq): Promise<im_server.GetHistoryMsgRsp>;

        /**
         * Calls GetRecentMsg.
         * @param request GetRecentMsgReq message or plain object
         * @param callback Node-style callback called with the error, if any, and GetRecentMsgRsp
         */
        public getRecentMsg(request: im_server.IGetRecentMsgReq, callback: im_server.MsgStorageService.GetRecentMsgCallback): void;

        /**
         * Calls GetRecentMsg.
         * @param request GetRecentMsgReq message or plain object
         * @returns Promise
         */
        public getRecentMsg(request: im_server.IGetRecentMsgReq): Promise<im_server.GetRecentMsgRsp>;

        /**
         * Calls MsgSearch.
         * @param request MsgSearchReq message or plain object
         * @param callback Node-style callback called with the error, if any, and MsgSearchRsp
         */
        public msgSearch(request: im_server.IMsgSearchReq, callback: im_server.MsgStorageService.MsgSearchCallback): void;

        /**
         * Calls MsgSearch.
         * @param request MsgSearchReq message or plain object
         * @returns Promise
         */
        public msgSearch(request: im_server.IMsgSearchReq): Promise<im_server.MsgSearchRsp>;
    }

    namespace MsgStorageService {

        /**
         * Callback as used by {@link im_server.MsgStorageService#getHistoryMsg}.
         * @param error Error, if any
         * @param [response] GetHistoryMsgRsp
         */
        type GetHistoryMsgCallback = (error: (Error|null), response?: im_server.GetHistoryMsgRsp) => void;

        /**
         * Callback as used by {@link im_server.MsgStorageService#getRecentMsg}.
         * @param error Error, if any
         * @param [response] GetRecentMsgRsp
         */
        type GetRecentMsgCallback = (error: (Error|null), response?: im_server.GetRecentMsgRsp) => void;

        /**
         * Callback as used by {@link im_server.MsgStorageService#msgSearch}.
         * @param error Error, if any
         * @param [response] MsgSearchRsp
         */
        type MsgSearchCallback = (error: (Error|null), response?: im_server.MsgSearchRsp) => void;
    }

    /** NotifyType enum. */
    enum NotifyType {
        FRIEND_ADD_APPLY_NOTIFY = 0,
        FRIEND_ADD_PROCESS_NOTIFY = 1,
        CHAT_SESSION_CREATE_NOTIFY = 2,
        CHAT_MESSAGE_NOTIFY = 3,
        FRIEND_REMOVE_NOTIFY = 4
    }

    /** Properties of a NotifyFriendAddApply. */
    interface INotifyFriendAddApply {

        /** NotifyFriendAddApply userInfo */
        userInfo?: (im_server.IUserInfo|null);
    }

    /** Represents a NotifyFriendAddApply. */
    class NotifyFriendAddApply implements INotifyFriendAddApply {

        /**
         * Constructs a new NotifyFriendAddApply.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.INotifyFriendAddApply);

        /** NotifyFriendAddApply userInfo. */
        public userInfo?: (im_server.IUserInfo|null);

        /**
         * Creates a new NotifyFriendAddApply instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NotifyFriendAddApply instance
         */
        public static create(properties?: im_server.INotifyFriendAddApply): im_server.NotifyFriendAddApply;

        /**
         * Encodes the specified NotifyFriendAddApply message. Does not implicitly {@link im_server.NotifyFriendAddApply.verify|verify} messages.
         * @param message NotifyFriendAddApply message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.INotifyFriendAddApply, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NotifyFriendAddApply message, length delimited. Does not implicitly {@link im_server.NotifyFriendAddApply.verify|verify} messages.
         * @param message NotifyFriendAddApply message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.INotifyFriendAddApply, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NotifyFriendAddApply message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NotifyFriendAddApply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.NotifyFriendAddApply;

        /**
         * Decodes a NotifyFriendAddApply message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NotifyFriendAddApply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.NotifyFriendAddApply;

        /**
         * Verifies a NotifyFriendAddApply message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NotifyFriendAddApply message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NotifyFriendAddApply
         */
        public static fromObject(object: { [k: string]: any }): im_server.NotifyFriendAddApply;

        /**
         * Creates a plain object from a NotifyFriendAddApply message. Also converts values to other types if specified.
         * @param message NotifyFriendAddApply
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.NotifyFriendAddApply, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NotifyFriendAddApply to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for NotifyFriendAddApply
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a NotifyFriendAddProcess. */
    interface INotifyFriendAddProcess {

        /** NotifyFriendAddProcess agree */
        agree?: (boolean|null);

        /** NotifyFriendAddProcess userInfo */
        userInfo?: (im_server.IUserInfo|null);
    }

    /** Represents a NotifyFriendAddProcess. */
    class NotifyFriendAddProcess implements INotifyFriendAddProcess {

        /**
         * Constructs a new NotifyFriendAddProcess.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.INotifyFriendAddProcess);

        /** NotifyFriendAddProcess agree. */
        public agree: boolean;

        /** NotifyFriendAddProcess userInfo. */
        public userInfo?: (im_server.IUserInfo|null);

        /**
         * Creates a new NotifyFriendAddProcess instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NotifyFriendAddProcess instance
         */
        public static create(properties?: im_server.INotifyFriendAddProcess): im_server.NotifyFriendAddProcess;

        /**
         * Encodes the specified NotifyFriendAddProcess message. Does not implicitly {@link im_server.NotifyFriendAddProcess.verify|verify} messages.
         * @param message NotifyFriendAddProcess message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.INotifyFriendAddProcess, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NotifyFriendAddProcess message, length delimited. Does not implicitly {@link im_server.NotifyFriendAddProcess.verify|verify} messages.
         * @param message NotifyFriendAddProcess message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.INotifyFriendAddProcess, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NotifyFriendAddProcess message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NotifyFriendAddProcess
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.NotifyFriendAddProcess;

        /**
         * Decodes a NotifyFriendAddProcess message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NotifyFriendAddProcess
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.NotifyFriendAddProcess;

        /**
         * Verifies a NotifyFriendAddProcess message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NotifyFriendAddProcess message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NotifyFriendAddProcess
         */
        public static fromObject(object: { [k: string]: any }): im_server.NotifyFriendAddProcess;

        /**
         * Creates a plain object from a NotifyFriendAddProcess message. Also converts values to other types if specified.
         * @param message NotifyFriendAddProcess
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.NotifyFriendAddProcess, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NotifyFriendAddProcess to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for NotifyFriendAddProcess
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a NotifyFriendRemove. */
    interface INotifyFriendRemove {

        /** NotifyFriendRemove userId */
        userId?: (string|null);
    }

    /** Represents a NotifyFriendRemove. */
    class NotifyFriendRemove implements INotifyFriendRemove {

        /**
         * Constructs a new NotifyFriendRemove.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.INotifyFriendRemove);

        /** NotifyFriendRemove userId. */
        public userId: string;

        /**
         * Creates a new NotifyFriendRemove instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NotifyFriendRemove instance
         */
        public static create(properties?: im_server.INotifyFriendRemove): im_server.NotifyFriendRemove;

        /**
         * Encodes the specified NotifyFriendRemove message. Does not implicitly {@link im_server.NotifyFriendRemove.verify|verify} messages.
         * @param message NotifyFriendRemove message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.INotifyFriendRemove, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NotifyFriendRemove message, length delimited. Does not implicitly {@link im_server.NotifyFriendRemove.verify|verify} messages.
         * @param message NotifyFriendRemove message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.INotifyFriendRemove, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NotifyFriendRemove message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NotifyFriendRemove
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.NotifyFriendRemove;

        /**
         * Decodes a NotifyFriendRemove message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NotifyFriendRemove
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.NotifyFriendRemove;

        /**
         * Verifies a NotifyFriendRemove message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NotifyFriendRemove message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NotifyFriendRemove
         */
        public static fromObject(object: { [k: string]: any }): im_server.NotifyFriendRemove;

        /**
         * Creates a plain object from a NotifyFriendRemove message. Also converts values to other types if specified.
         * @param message NotifyFriendRemove
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.NotifyFriendRemove, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NotifyFriendRemove to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for NotifyFriendRemove
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a NotifyNewChatSession. */
    interface INotifyNewChatSession {

        /** NotifyNewChatSession chatSessionInfo */
        chatSessionInfo?: (im_server.IChatSessionInfo|null);
    }

    /** Represents a NotifyNewChatSession. */
    class NotifyNewChatSession implements INotifyNewChatSession {

        /**
         * Constructs a new NotifyNewChatSession.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.INotifyNewChatSession);

        /** NotifyNewChatSession chatSessionInfo. */
        public chatSessionInfo?: (im_server.IChatSessionInfo|null);

        /**
         * Creates a new NotifyNewChatSession instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NotifyNewChatSession instance
         */
        public static create(properties?: im_server.INotifyNewChatSession): im_server.NotifyNewChatSession;

        /**
         * Encodes the specified NotifyNewChatSession message. Does not implicitly {@link im_server.NotifyNewChatSession.verify|verify} messages.
         * @param message NotifyNewChatSession message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.INotifyNewChatSession, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NotifyNewChatSession message, length delimited. Does not implicitly {@link im_server.NotifyNewChatSession.verify|verify} messages.
         * @param message NotifyNewChatSession message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.INotifyNewChatSession, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NotifyNewChatSession message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NotifyNewChatSession
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.NotifyNewChatSession;

        /**
         * Decodes a NotifyNewChatSession message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NotifyNewChatSession
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.NotifyNewChatSession;

        /**
         * Verifies a NotifyNewChatSession message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NotifyNewChatSession message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NotifyNewChatSession
         */
        public static fromObject(object: { [k: string]: any }): im_server.NotifyNewChatSession;

        /**
         * Creates a plain object from a NotifyNewChatSession message. Also converts values to other types if specified.
         * @param message NotifyNewChatSession
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.NotifyNewChatSession, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NotifyNewChatSession to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for NotifyNewChatSession
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a NotifyNewMessage. */
    interface INotifyNewMessage {

        /** NotifyNewMessage messageInfo */
        messageInfo?: (im_server.IMessageInfo|null);
    }

    /** Represents a NotifyNewMessage. */
    class NotifyNewMessage implements INotifyNewMessage {

        /**
         * Constructs a new NotifyNewMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.INotifyNewMessage);

        /** NotifyNewMessage messageInfo. */
        public messageInfo?: (im_server.IMessageInfo|null);

        /**
         * Creates a new NotifyNewMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NotifyNewMessage instance
         */
        public static create(properties?: im_server.INotifyNewMessage): im_server.NotifyNewMessage;

        /**
         * Encodes the specified NotifyNewMessage message. Does not implicitly {@link im_server.NotifyNewMessage.verify|verify} messages.
         * @param message NotifyNewMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.INotifyNewMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NotifyNewMessage message, length delimited. Does not implicitly {@link im_server.NotifyNewMessage.verify|verify} messages.
         * @param message NotifyNewMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.INotifyNewMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NotifyNewMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NotifyNewMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.NotifyNewMessage;

        /**
         * Decodes a NotifyNewMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NotifyNewMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.NotifyNewMessage;

        /**
         * Verifies a NotifyNewMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NotifyNewMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NotifyNewMessage
         */
        public static fromObject(object: { [k: string]: any }): im_server.NotifyNewMessage;

        /**
         * Creates a plain object from a NotifyNewMessage message. Also converts values to other types if specified.
         * @param message NotifyNewMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.NotifyNewMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NotifyNewMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for NotifyNewMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a NotifyMessage. */
    interface INotifyMessage {

        /** NotifyMessage notifyEventId */
        notifyEventId?: (string|null);

        /** NotifyMessage notifyType */
        notifyType?: (im_server.NotifyType|null);

        /** NotifyMessage friendAddApply */
        friendAddApply?: (im_server.INotifyFriendAddApply|null);

        /** NotifyMessage friendProcessResult */
        friendProcessResult?: (im_server.INotifyFriendAddProcess|null);

        /** NotifyMessage friendRemove */
        friendRemove?: (im_server.INotifyFriendRemove|null);

        /** NotifyMessage newChatSessionInfo */
        newChatSessionInfo?: (im_server.INotifyNewChatSession|null);

        /** NotifyMessage newMessageInfo */
        newMessageInfo?: (im_server.INotifyNewMessage|null);
    }

    /** Represents a NotifyMessage. */
    class NotifyMessage implements INotifyMessage {

        /**
         * Constructs a new NotifyMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.INotifyMessage);

        /** NotifyMessage notifyEventId. */
        public notifyEventId?: (string|null);

        /** NotifyMessage notifyType. */
        public notifyType: im_server.NotifyType;

        /** NotifyMessage friendAddApply. */
        public friendAddApply?: (im_server.INotifyFriendAddApply|null);

        /** NotifyMessage friendProcessResult. */
        public friendProcessResult?: (im_server.INotifyFriendAddProcess|null);

        /** NotifyMessage friendRemove. */
        public friendRemove?: (im_server.INotifyFriendRemove|null);

        /** NotifyMessage newChatSessionInfo. */
        public newChatSessionInfo?: (im_server.INotifyNewChatSession|null);

        /** NotifyMessage newMessageInfo. */
        public newMessageInfo?: (im_server.INotifyNewMessage|null);

        /** NotifyMessage notifyRemarks. */
        public notifyRemarks?: ("friendAddApply"|"friendProcessResult"|"friendRemove"|"newChatSessionInfo"|"newMessageInfo");

        /**
         * Creates a new NotifyMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NotifyMessage instance
         */
        public static create(properties?: im_server.INotifyMessage): im_server.NotifyMessage;

        /**
         * Encodes the specified NotifyMessage message. Does not implicitly {@link im_server.NotifyMessage.verify|verify} messages.
         * @param message NotifyMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.INotifyMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NotifyMessage message, length delimited. Does not implicitly {@link im_server.NotifyMessage.verify|verify} messages.
         * @param message NotifyMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.INotifyMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NotifyMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NotifyMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.NotifyMessage;

        /**
         * Decodes a NotifyMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NotifyMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.NotifyMessage;

        /**
         * Verifies a NotifyMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NotifyMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NotifyMessage
         */
        public static fromObject(object: { [k: string]: any }): im_server.NotifyMessage;

        /**
         * Creates a plain object from a NotifyMessage message. Also converts values to other types if specified.
         * @param message NotifyMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.NotifyMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NotifyMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for NotifyMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SpeechRecognitionReq. */
    interface ISpeechRecognitionReq {

        /** SpeechRecognitionReq requestId */
        requestId?: (string|null);

        /** SpeechRecognitionReq speechContent */
        speechContent?: (Uint8Array|null);

        /** SpeechRecognitionReq userId */
        userId?: (string|null);

        /** SpeechRecognitionReq sessionId */
        sessionId?: (string|null);
    }

    /** Represents a SpeechRecognitionReq. */
    class SpeechRecognitionReq implements ISpeechRecognitionReq {

        /**
         * Constructs a new SpeechRecognitionReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.ISpeechRecognitionReq);

        /** SpeechRecognitionReq requestId. */
        public requestId: string;

        /** SpeechRecognitionReq speechContent. */
        public speechContent: Uint8Array;

        /** SpeechRecognitionReq userId. */
        public userId?: (string|null);

        /** SpeechRecognitionReq sessionId. */
        public sessionId?: (string|null);

        /**
         * Creates a new SpeechRecognitionReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SpeechRecognitionReq instance
         */
        public static create(properties?: im_server.ISpeechRecognitionReq): im_server.SpeechRecognitionReq;

        /**
         * Encodes the specified SpeechRecognitionReq message. Does not implicitly {@link im_server.SpeechRecognitionReq.verify|verify} messages.
         * @param message SpeechRecognitionReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.ISpeechRecognitionReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SpeechRecognitionReq message, length delimited. Does not implicitly {@link im_server.SpeechRecognitionReq.verify|verify} messages.
         * @param message SpeechRecognitionReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.ISpeechRecognitionReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SpeechRecognitionReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SpeechRecognitionReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.SpeechRecognitionReq;

        /**
         * Decodes a SpeechRecognitionReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SpeechRecognitionReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.SpeechRecognitionReq;

        /**
         * Verifies a SpeechRecognitionReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SpeechRecognitionReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SpeechRecognitionReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.SpeechRecognitionReq;

        /**
         * Creates a plain object from a SpeechRecognitionReq message. Also converts values to other types if specified.
         * @param message SpeechRecognitionReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.SpeechRecognitionReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SpeechRecognitionReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SpeechRecognitionReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SpeechRecognitionRsp. */
    interface ISpeechRecognitionRsp {

        /** SpeechRecognitionRsp requestId */
        requestId?: (string|null);

        /** SpeechRecognitionRsp success */
        success?: (boolean|null);

        /** SpeechRecognitionRsp errmsg */
        errmsg?: (string|null);

        /** SpeechRecognitionRsp recognitionResult */
        recognitionResult?: (string|null);
    }

    /** Represents a SpeechRecognitionRsp. */
    class SpeechRecognitionRsp implements ISpeechRecognitionRsp {

        /**
         * Constructs a new SpeechRecognitionRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.ISpeechRecognitionRsp);

        /** SpeechRecognitionRsp requestId. */
        public requestId: string;

        /** SpeechRecognitionRsp success. */
        public success: boolean;

        /** SpeechRecognitionRsp errmsg. */
        public errmsg?: (string|null);

        /** SpeechRecognitionRsp recognitionResult. */
        public recognitionResult?: (string|null);

        /**
         * Creates a new SpeechRecognitionRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SpeechRecognitionRsp instance
         */
        public static create(properties?: im_server.ISpeechRecognitionRsp): im_server.SpeechRecognitionRsp;

        /**
         * Encodes the specified SpeechRecognitionRsp message. Does not implicitly {@link im_server.SpeechRecognitionRsp.verify|verify} messages.
         * @param message SpeechRecognitionRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.ISpeechRecognitionRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SpeechRecognitionRsp message, length delimited. Does not implicitly {@link im_server.SpeechRecognitionRsp.verify|verify} messages.
         * @param message SpeechRecognitionRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.ISpeechRecognitionRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SpeechRecognitionRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SpeechRecognitionRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.SpeechRecognitionRsp;

        /**
         * Decodes a SpeechRecognitionRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SpeechRecognitionRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.SpeechRecognitionRsp;

        /**
         * Verifies a SpeechRecognitionRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SpeechRecognitionRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SpeechRecognitionRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.SpeechRecognitionRsp;

        /**
         * Creates a plain object from a SpeechRecognitionRsp message. Also converts values to other types if specified.
         * @param message SpeechRecognitionRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.SpeechRecognitionRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SpeechRecognitionRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SpeechRecognitionRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Represents a SpeechService */
    class SpeechService extends $protobuf.rpc.Service {

        /**
         * Constructs a new SpeechService service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new SpeechService service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): SpeechService;

        /**
         * Calls SpeechRecognition.
         * @param request SpeechRecognitionReq message or plain object
         * @param callback Node-style callback called with the error, if any, and SpeechRecognitionRsp
         */
        public speechRecognition(request: im_server.ISpeechRecognitionReq, callback: im_server.SpeechService.SpeechRecognitionCallback): void;

        /**
         * Calls SpeechRecognition.
         * @param request SpeechRecognitionReq message or plain object
         * @returns Promise
         */
        public speechRecognition(request: im_server.ISpeechRecognitionReq): Promise<im_server.SpeechRecognitionRsp>;
    }

    namespace SpeechService {

        /**
         * Callback as used by {@link im_server.SpeechService#speechRecognition}.
         * @param error Error, if any
         * @param [response] SpeechRecognitionRsp
         */
        type SpeechRecognitionCallback = (error: (Error|null), response?: im_server.SpeechRecognitionRsp) => void;
    }

    /** Properties of a NewMessageReq. */
    interface INewMessageReq {

        /** NewMessageReq requestId */
        requestId?: (string|null);

        /** NewMessageReq userId */
        userId?: (string|null);

        /** NewMessageReq sessionId */
        sessionId?: (string|null);

        /** NewMessageReq chatSessionId */
        chatSessionId?: (string|null);

        /** NewMessageReq message */
        message?: (im_server.IMessageContent|null);
    }

    /** Represents a NewMessageReq. */
    class NewMessageReq implements INewMessageReq {

        /**
         * Constructs a new NewMessageReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.INewMessageReq);

        /** NewMessageReq requestId. */
        public requestId: string;

        /** NewMessageReq userId. */
        public userId?: (string|null);

        /** NewMessageReq sessionId. */
        public sessionId?: (string|null);

        /** NewMessageReq chatSessionId. */
        public chatSessionId: string;

        /** NewMessageReq message. */
        public message?: (im_server.IMessageContent|null);

        /**
         * Creates a new NewMessageReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NewMessageReq instance
         */
        public static create(properties?: im_server.INewMessageReq): im_server.NewMessageReq;

        /**
         * Encodes the specified NewMessageReq message. Does not implicitly {@link im_server.NewMessageReq.verify|verify} messages.
         * @param message NewMessageReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.INewMessageReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NewMessageReq message, length delimited. Does not implicitly {@link im_server.NewMessageReq.verify|verify} messages.
         * @param message NewMessageReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.INewMessageReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NewMessageReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NewMessageReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.NewMessageReq;

        /**
         * Decodes a NewMessageReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NewMessageReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.NewMessageReq;

        /**
         * Verifies a NewMessageReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NewMessageReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NewMessageReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.NewMessageReq;

        /**
         * Creates a plain object from a NewMessageReq message. Also converts values to other types if specified.
         * @param message NewMessageReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.NewMessageReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NewMessageReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for NewMessageReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a NewMessageRsp. */
    interface INewMessageRsp {

        /** NewMessageRsp requestId */
        requestId?: (string|null);

        /** NewMessageRsp success */
        success?: (boolean|null);

        /** NewMessageRsp errmsg */
        errmsg?: (string|null);
    }

    /** Represents a NewMessageRsp. */
    class NewMessageRsp implements INewMessageRsp {

        /**
         * Constructs a new NewMessageRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.INewMessageRsp);

        /** NewMessageRsp requestId. */
        public requestId: string;

        /** NewMessageRsp success. */
        public success: boolean;

        /** NewMessageRsp errmsg. */
        public errmsg: string;

        /**
         * Creates a new NewMessageRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NewMessageRsp instance
         */
        public static create(properties?: im_server.INewMessageRsp): im_server.NewMessageRsp;

        /**
         * Encodes the specified NewMessageRsp message. Does not implicitly {@link im_server.NewMessageRsp.verify|verify} messages.
         * @param message NewMessageRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.INewMessageRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NewMessageRsp message, length delimited. Does not implicitly {@link im_server.NewMessageRsp.verify|verify} messages.
         * @param message NewMessageRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.INewMessageRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NewMessageRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NewMessageRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.NewMessageRsp;

        /**
         * Decodes a NewMessageRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NewMessageRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.NewMessageRsp;

        /**
         * Verifies a NewMessageRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NewMessageRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NewMessageRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.NewMessageRsp;

        /**
         * Creates a plain object from a NewMessageRsp message. Also converts values to other types if specified.
         * @param message NewMessageRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.NewMessageRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NewMessageRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for NewMessageRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetTransmitTargetRsp. */
    interface IGetTransmitTargetRsp {

        /** GetTransmitTargetRsp requestId */
        requestId?: (string|null);

        /** GetTransmitTargetRsp success */
        success?: (boolean|null);

        /** GetTransmitTargetRsp errmsg */
        errmsg?: (string|null);

        /** GetTransmitTargetRsp message */
        message?: (im_server.IMessageInfo|null);

        /** GetTransmitTargetRsp targetIdList */
        targetIdList?: (string[]|null);
    }

    /** Represents a GetTransmitTargetRsp. */
    class GetTransmitTargetRsp implements IGetTransmitTargetRsp {

        /**
         * Constructs a new GetTransmitTargetRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetTransmitTargetRsp);

        /** GetTransmitTargetRsp requestId. */
        public requestId: string;

        /** GetTransmitTargetRsp success. */
        public success: boolean;

        /** GetTransmitTargetRsp errmsg. */
        public errmsg: string;

        /** GetTransmitTargetRsp message. */
        public message?: (im_server.IMessageInfo|null);

        /** GetTransmitTargetRsp targetIdList. */
        public targetIdList: string[];

        /**
         * Creates a new GetTransmitTargetRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetTransmitTargetRsp instance
         */
        public static create(properties?: im_server.IGetTransmitTargetRsp): im_server.GetTransmitTargetRsp;

        /**
         * Encodes the specified GetTransmitTargetRsp message. Does not implicitly {@link im_server.GetTransmitTargetRsp.verify|verify} messages.
         * @param message GetTransmitTargetRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetTransmitTargetRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetTransmitTargetRsp message, length delimited. Does not implicitly {@link im_server.GetTransmitTargetRsp.verify|verify} messages.
         * @param message GetTransmitTargetRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetTransmitTargetRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetTransmitTargetRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetTransmitTargetRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetTransmitTargetRsp;

        /**
         * Decodes a GetTransmitTargetRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetTransmitTargetRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetTransmitTargetRsp;

        /**
         * Verifies a GetTransmitTargetRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetTransmitTargetRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetTransmitTargetRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetTransmitTargetRsp;

        /**
         * Creates a plain object from a GetTransmitTargetRsp message. Also converts values to other types if specified.
         * @param message GetTransmitTargetRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetTransmitTargetRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetTransmitTargetRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetTransmitTargetRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Represents a MsgTransmitService */
    class MsgTransmitService extends $protobuf.rpc.Service {

        /**
         * Constructs a new MsgTransmitService service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new MsgTransmitService service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): MsgTransmitService;

        /**
         * Calls GetTransmitTarget.
         * @param request NewMessageReq message or plain object
         * @param callback Node-style callback called with the error, if any, and GetTransmitTargetRsp
         */
        public getTransmitTarget(request: im_server.INewMessageReq, callback: im_server.MsgTransmitService.GetTransmitTargetCallback): void;

        /**
         * Calls GetTransmitTarget.
         * @param request NewMessageReq message or plain object
         * @returns Promise
         */
        public getTransmitTarget(request: im_server.INewMessageReq): Promise<im_server.GetTransmitTargetRsp>;
    }

    namespace MsgTransmitService {

        /**
         * Callback as used by {@link im_server.MsgTransmitService#getTransmitTarget}.
         * @param error Error, if any
         * @param [response] GetTransmitTargetRsp
         */
        type GetTransmitTargetCallback = (error: (Error|null), response?: im_server.GetTransmitTargetRsp) => void;
    }

    /** Properties of a UserRegisterReq. */
    interface IUserRegisterReq {

        /** UserRegisterReq requestId */
        requestId?: (string|null);

        /** UserRegisterReq nickname */
        nickname?: (string|null);

        /** UserRegisterReq password */
        password?: (string|null);

        /** UserRegisterReq verifyCodeId */
        verifyCodeId?: (string|null);

        /** UserRegisterReq verifyCode */
        verifyCode?: (string|null);
    }

    /** Represents a UserRegisterReq. */
    class UserRegisterReq implements IUserRegisterReq {

        /**
         * Constructs a new UserRegisterReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IUserRegisterReq);

        /** UserRegisterReq requestId. */
        public requestId: string;

        /** UserRegisterReq nickname. */
        public nickname: string;

        /** UserRegisterReq password. */
        public password: string;

        /** UserRegisterReq verifyCodeId. */
        public verifyCodeId?: (string|null);

        /** UserRegisterReq verifyCode. */
        public verifyCode?: (string|null);

        /**
         * Creates a new UserRegisterReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserRegisterReq instance
         */
        public static create(properties?: im_server.IUserRegisterReq): im_server.UserRegisterReq;

        /**
         * Encodes the specified UserRegisterReq message. Does not implicitly {@link im_server.UserRegisterReq.verify|verify} messages.
         * @param message UserRegisterReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IUserRegisterReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserRegisterReq message, length delimited. Does not implicitly {@link im_server.UserRegisterReq.verify|verify} messages.
         * @param message UserRegisterReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IUserRegisterReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserRegisterReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserRegisterReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.UserRegisterReq;

        /**
         * Decodes a UserRegisterReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserRegisterReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.UserRegisterReq;

        /**
         * Verifies a UserRegisterReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserRegisterReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserRegisterReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.UserRegisterReq;

        /**
         * Creates a plain object from a UserRegisterReq message. Also converts values to other types if specified.
         * @param message UserRegisterReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.UserRegisterReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserRegisterReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UserRegisterReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a UserRegisterRsp. */
    interface IUserRegisterRsp {

        /** UserRegisterRsp requestId */
        requestId?: (string|null);

        /** UserRegisterRsp success */
        success?: (boolean|null);

        /** UserRegisterRsp errmsg */
        errmsg?: (string|null);
    }

    /** Represents a UserRegisterRsp. */
    class UserRegisterRsp implements IUserRegisterRsp {

        /**
         * Constructs a new UserRegisterRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IUserRegisterRsp);

        /** UserRegisterRsp requestId. */
        public requestId: string;

        /** UserRegisterRsp success. */
        public success: boolean;

        /** UserRegisterRsp errmsg. */
        public errmsg: string;

        /**
         * Creates a new UserRegisterRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserRegisterRsp instance
         */
        public static create(properties?: im_server.IUserRegisterRsp): im_server.UserRegisterRsp;

        /**
         * Encodes the specified UserRegisterRsp message. Does not implicitly {@link im_server.UserRegisterRsp.verify|verify} messages.
         * @param message UserRegisterRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IUserRegisterRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserRegisterRsp message, length delimited. Does not implicitly {@link im_server.UserRegisterRsp.verify|verify} messages.
         * @param message UserRegisterRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IUserRegisterRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserRegisterRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserRegisterRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.UserRegisterRsp;

        /**
         * Decodes a UserRegisterRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserRegisterRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.UserRegisterRsp;

        /**
         * Verifies a UserRegisterRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserRegisterRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserRegisterRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.UserRegisterRsp;

        /**
         * Creates a plain object from a UserRegisterRsp message. Also converts values to other types if specified.
         * @param message UserRegisterRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.UserRegisterRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserRegisterRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UserRegisterRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a UserLoginReq. */
    interface IUserLoginReq {

        /** UserLoginReq requestId */
        requestId?: (string|null);

        /** UserLoginReq nickname */
        nickname?: (string|null);

        /** UserLoginReq password */
        password?: (string|null);

        /** UserLoginReq verifyCodeId */
        verifyCodeId?: (string|null);

        /** UserLoginReq verifyCode */
        verifyCode?: (string|null);
    }

    /** Represents a UserLoginReq. */
    class UserLoginReq implements IUserLoginReq {

        /**
         * Constructs a new UserLoginReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IUserLoginReq);

        /** UserLoginReq requestId. */
        public requestId: string;

        /** UserLoginReq nickname. */
        public nickname: string;

        /** UserLoginReq password. */
        public password: string;

        /** UserLoginReq verifyCodeId. */
        public verifyCodeId: string;

        /** UserLoginReq verifyCode. */
        public verifyCode: string;

        /**
         * Creates a new UserLoginReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserLoginReq instance
         */
        public static create(properties?: im_server.IUserLoginReq): im_server.UserLoginReq;

        /**
         * Encodes the specified UserLoginReq message. Does not implicitly {@link im_server.UserLoginReq.verify|verify} messages.
         * @param message UserLoginReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IUserLoginReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserLoginReq message, length delimited. Does not implicitly {@link im_server.UserLoginReq.verify|verify} messages.
         * @param message UserLoginReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IUserLoginReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserLoginReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserLoginReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.UserLoginReq;

        /**
         * Decodes a UserLoginReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserLoginReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.UserLoginReq;

        /**
         * Verifies a UserLoginReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserLoginReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserLoginReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.UserLoginReq;

        /**
         * Creates a plain object from a UserLoginReq message. Also converts values to other types if specified.
         * @param message UserLoginReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.UserLoginReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserLoginReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UserLoginReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a UserLoginRsp. */
    interface IUserLoginRsp {

        /** UserLoginRsp requestId */
        requestId?: (string|null);

        /** UserLoginRsp success */
        success?: (boolean|null);

        /** UserLoginRsp errmsg */
        errmsg?: (string|null);

        /** UserLoginRsp loginSessionId */
        loginSessionId?: (string|null);
    }

    /** Represents a UserLoginRsp. */
    class UserLoginRsp implements IUserLoginRsp {

        /**
         * Constructs a new UserLoginRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IUserLoginRsp);

        /** UserLoginRsp requestId. */
        public requestId: string;

        /** UserLoginRsp success. */
        public success: boolean;

        /** UserLoginRsp errmsg. */
        public errmsg: string;

        /** UserLoginRsp loginSessionId. */
        public loginSessionId: string;

        /**
         * Creates a new UserLoginRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserLoginRsp instance
         */
        public static create(properties?: im_server.IUserLoginRsp): im_server.UserLoginRsp;

        /**
         * Encodes the specified UserLoginRsp message. Does not implicitly {@link im_server.UserLoginRsp.verify|verify} messages.
         * @param message UserLoginRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IUserLoginRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserLoginRsp message, length delimited. Does not implicitly {@link im_server.UserLoginRsp.verify|verify} messages.
         * @param message UserLoginRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IUserLoginRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserLoginRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserLoginRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.UserLoginRsp;

        /**
         * Decodes a UserLoginRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserLoginRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.UserLoginRsp;

        /**
         * Verifies a UserLoginRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserLoginRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserLoginRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.UserLoginRsp;

        /**
         * Creates a plain object from a UserLoginRsp message. Also converts values to other types if specified.
         * @param message UserLoginRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.UserLoginRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserLoginRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UserLoginRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PhoneVerifyCodeReq. */
    interface IPhoneVerifyCodeReq {

        /** PhoneVerifyCodeReq requestId */
        requestId?: (string|null);

        /** PhoneVerifyCodeReq phoneNumber */
        phoneNumber?: (string|null);
    }

    /** Represents a PhoneVerifyCodeReq. */
    class PhoneVerifyCodeReq implements IPhoneVerifyCodeReq {

        /**
         * Constructs a new PhoneVerifyCodeReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IPhoneVerifyCodeReq);

        /** PhoneVerifyCodeReq requestId. */
        public requestId: string;

        /** PhoneVerifyCodeReq phoneNumber. */
        public phoneNumber: string;

        /**
         * Creates a new PhoneVerifyCodeReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PhoneVerifyCodeReq instance
         */
        public static create(properties?: im_server.IPhoneVerifyCodeReq): im_server.PhoneVerifyCodeReq;

        /**
         * Encodes the specified PhoneVerifyCodeReq message. Does not implicitly {@link im_server.PhoneVerifyCodeReq.verify|verify} messages.
         * @param message PhoneVerifyCodeReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IPhoneVerifyCodeReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PhoneVerifyCodeReq message, length delimited. Does not implicitly {@link im_server.PhoneVerifyCodeReq.verify|verify} messages.
         * @param message PhoneVerifyCodeReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IPhoneVerifyCodeReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PhoneVerifyCodeReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PhoneVerifyCodeReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.PhoneVerifyCodeReq;

        /**
         * Decodes a PhoneVerifyCodeReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PhoneVerifyCodeReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.PhoneVerifyCodeReq;

        /**
         * Verifies a PhoneVerifyCodeReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PhoneVerifyCodeReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PhoneVerifyCodeReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.PhoneVerifyCodeReq;

        /**
         * Creates a plain object from a PhoneVerifyCodeReq message. Also converts values to other types if specified.
         * @param message PhoneVerifyCodeReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.PhoneVerifyCodeReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PhoneVerifyCodeReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PhoneVerifyCodeReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PhoneVerifyCodeRsp. */
    interface IPhoneVerifyCodeRsp {

        /** PhoneVerifyCodeRsp requestId */
        requestId?: (string|null);

        /** PhoneVerifyCodeRsp success */
        success?: (boolean|null);

        /** PhoneVerifyCodeRsp errmsg */
        errmsg?: (string|null);

        /** PhoneVerifyCodeRsp verifyCodeId */
        verifyCodeId?: (string|null);
    }

    /** Represents a PhoneVerifyCodeRsp. */
    class PhoneVerifyCodeRsp implements IPhoneVerifyCodeRsp {

        /**
         * Constructs a new PhoneVerifyCodeRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IPhoneVerifyCodeRsp);

        /** PhoneVerifyCodeRsp requestId. */
        public requestId: string;

        /** PhoneVerifyCodeRsp success. */
        public success: boolean;

        /** PhoneVerifyCodeRsp errmsg. */
        public errmsg: string;

        /** PhoneVerifyCodeRsp verifyCodeId. */
        public verifyCodeId: string;

        /**
         * Creates a new PhoneVerifyCodeRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PhoneVerifyCodeRsp instance
         */
        public static create(properties?: im_server.IPhoneVerifyCodeRsp): im_server.PhoneVerifyCodeRsp;

        /**
         * Encodes the specified PhoneVerifyCodeRsp message. Does not implicitly {@link im_server.PhoneVerifyCodeRsp.verify|verify} messages.
         * @param message PhoneVerifyCodeRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IPhoneVerifyCodeRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PhoneVerifyCodeRsp message, length delimited. Does not implicitly {@link im_server.PhoneVerifyCodeRsp.verify|verify} messages.
         * @param message PhoneVerifyCodeRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IPhoneVerifyCodeRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PhoneVerifyCodeRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PhoneVerifyCodeRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.PhoneVerifyCodeRsp;

        /**
         * Decodes a PhoneVerifyCodeRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PhoneVerifyCodeRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.PhoneVerifyCodeRsp;

        /**
         * Verifies a PhoneVerifyCodeRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PhoneVerifyCodeRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PhoneVerifyCodeRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.PhoneVerifyCodeRsp;

        /**
         * Creates a plain object from a PhoneVerifyCodeRsp message. Also converts values to other types if specified.
         * @param message PhoneVerifyCodeRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.PhoneVerifyCodeRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PhoneVerifyCodeRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PhoneVerifyCodeRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PhoneRegisterReq. */
    interface IPhoneRegisterReq {

        /** PhoneRegisterReq requestId */
        requestId?: (string|null);

        /** PhoneRegisterReq phoneNumber */
        phoneNumber?: (string|null);

        /** PhoneRegisterReq verifyCodeId */
        verifyCodeId?: (string|null);

        /** PhoneRegisterReq verifyCode */
        verifyCode?: (string|null);
    }

    /** Represents a PhoneRegisterReq. */
    class PhoneRegisterReq implements IPhoneRegisterReq {

        /**
         * Constructs a new PhoneRegisterReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IPhoneRegisterReq);

        /** PhoneRegisterReq requestId. */
        public requestId: string;

        /** PhoneRegisterReq phoneNumber. */
        public phoneNumber: string;

        /** PhoneRegisterReq verifyCodeId. */
        public verifyCodeId: string;

        /** PhoneRegisterReq verifyCode. */
        public verifyCode: string;

        /**
         * Creates a new PhoneRegisterReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PhoneRegisterReq instance
         */
        public static create(properties?: im_server.IPhoneRegisterReq): im_server.PhoneRegisterReq;

        /**
         * Encodes the specified PhoneRegisterReq message. Does not implicitly {@link im_server.PhoneRegisterReq.verify|verify} messages.
         * @param message PhoneRegisterReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IPhoneRegisterReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PhoneRegisterReq message, length delimited. Does not implicitly {@link im_server.PhoneRegisterReq.verify|verify} messages.
         * @param message PhoneRegisterReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IPhoneRegisterReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PhoneRegisterReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PhoneRegisterReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.PhoneRegisterReq;

        /**
         * Decodes a PhoneRegisterReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PhoneRegisterReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.PhoneRegisterReq;

        /**
         * Verifies a PhoneRegisterReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PhoneRegisterReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PhoneRegisterReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.PhoneRegisterReq;

        /**
         * Creates a plain object from a PhoneRegisterReq message. Also converts values to other types if specified.
         * @param message PhoneRegisterReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.PhoneRegisterReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PhoneRegisterReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PhoneRegisterReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PhoneRegisterRsp. */
    interface IPhoneRegisterRsp {

        /** PhoneRegisterRsp requestId */
        requestId?: (string|null);

        /** PhoneRegisterRsp success */
        success?: (boolean|null);

        /** PhoneRegisterRsp errmsg */
        errmsg?: (string|null);
    }

    /** Represents a PhoneRegisterRsp. */
    class PhoneRegisterRsp implements IPhoneRegisterRsp {

        /**
         * Constructs a new PhoneRegisterRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IPhoneRegisterRsp);

        /** PhoneRegisterRsp requestId. */
        public requestId: string;

        /** PhoneRegisterRsp success. */
        public success: boolean;

        /** PhoneRegisterRsp errmsg. */
        public errmsg: string;

        /**
         * Creates a new PhoneRegisterRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PhoneRegisterRsp instance
         */
        public static create(properties?: im_server.IPhoneRegisterRsp): im_server.PhoneRegisterRsp;

        /**
         * Encodes the specified PhoneRegisterRsp message. Does not implicitly {@link im_server.PhoneRegisterRsp.verify|verify} messages.
         * @param message PhoneRegisterRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IPhoneRegisterRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PhoneRegisterRsp message, length delimited. Does not implicitly {@link im_server.PhoneRegisterRsp.verify|verify} messages.
         * @param message PhoneRegisterRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IPhoneRegisterRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PhoneRegisterRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PhoneRegisterRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.PhoneRegisterRsp;

        /**
         * Decodes a PhoneRegisterRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PhoneRegisterRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.PhoneRegisterRsp;

        /**
         * Verifies a PhoneRegisterRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PhoneRegisterRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PhoneRegisterRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.PhoneRegisterRsp;

        /**
         * Creates a plain object from a PhoneRegisterRsp message. Also converts values to other types if specified.
         * @param message PhoneRegisterRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.PhoneRegisterRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PhoneRegisterRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PhoneRegisterRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PhoneLoginReq. */
    interface IPhoneLoginReq {

        /** PhoneLoginReq requestId */
        requestId?: (string|null);

        /** PhoneLoginReq phoneNumber */
        phoneNumber?: (string|null);

        /** PhoneLoginReq verifyCodeId */
        verifyCodeId?: (string|null);

        /** PhoneLoginReq verifyCode */
        verifyCode?: (string|null);
    }

    /** Represents a PhoneLoginReq. */
    class PhoneLoginReq implements IPhoneLoginReq {

        /**
         * Constructs a new PhoneLoginReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IPhoneLoginReq);

        /** PhoneLoginReq requestId. */
        public requestId: string;

        /** PhoneLoginReq phoneNumber. */
        public phoneNumber: string;

        /** PhoneLoginReq verifyCodeId. */
        public verifyCodeId: string;

        /** PhoneLoginReq verifyCode. */
        public verifyCode: string;

        /**
         * Creates a new PhoneLoginReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PhoneLoginReq instance
         */
        public static create(properties?: im_server.IPhoneLoginReq): im_server.PhoneLoginReq;

        /**
         * Encodes the specified PhoneLoginReq message. Does not implicitly {@link im_server.PhoneLoginReq.verify|verify} messages.
         * @param message PhoneLoginReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IPhoneLoginReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PhoneLoginReq message, length delimited. Does not implicitly {@link im_server.PhoneLoginReq.verify|verify} messages.
         * @param message PhoneLoginReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IPhoneLoginReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PhoneLoginReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PhoneLoginReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.PhoneLoginReq;

        /**
         * Decodes a PhoneLoginReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PhoneLoginReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.PhoneLoginReq;

        /**
         * Verifies a PhoneLoginReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PhoneLoginReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PhoneLoginReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.PhoneLoginReq;

        /**
         * Creates a plain object from a PhoneLoginReq message. Also converts values to other types if specified.
         * @param message PhoneLoginReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.PhoneLoginReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PhoneLoginReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PhoneLoginReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PhoneLoginRsp. */
    interface IPhoneLoginRsp {

        /** PhoneLoginRsp requestId */
        requestId?: (string|null);

        /** PhoneLoginRsp success */
        success?: (boolean|null);

        /** PhoneLoginRsp errmsg */
        errmsg?: (string|null);

        /** PhoneLoginRsp loginSessionId */
        loginSessionId?: (string|null);
    }

    /** Represents a PhoneLoginRsp. */
    class PhoneLoginRsp implements IPhoneLoginRsp {

        /**
         * Constructs a new PhoneLoginRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IPhoneLoginRsp);

        /** PhoneLoginRsp requestId. */
        public requestId: string;

        /** PhoneLoginRsp success. */
        public success: boolean;

        /** PhoneLoginRsp errmsg. */
        public errmsg: string;

        /** PhoneLoginRsp loginSessionId. */
        public loginSessionId: string;

        /**
         * Creates a new PhoneLoginRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PhoneLoginRsp instance
         */
        public static create(properties?: im_server.IPhoneLoginRsp): im_server.PhoneLoginRsp;

        /**
         * Encodes the specified PhoneLoginRsp message. Does not implicitly {@link im_server.PhoneLoginRsp.verify|verify} messages.
         * @param message PhoneLoginRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IPhoneLoginRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PhoneLoginRsp message, length delimited. Does not implicitly {@link im_server.PhoneLoginRsp.verify|verify} messages.
         * @param message PhoneLoginRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IPhoneLoginRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PhoneLoginRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PhoneLoginRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.PhoneLoginRsp;

        /**
         * Decodes a PhoneLoginRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PhoneLoginRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.PhoneLoginRsp;

        /**
         * Verifies a PhoneLoginRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PhoneLoginRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PhoneLoginRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.PhoneLoginRsp;

        /**
         * Creates a plain object from a PhoneLoginRsp message. Also converts values to other types if specified.
         * @param message PhoneLoginRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.PhoneLoginRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PhoneLoginRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PhoneLoginRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetUserInfoReq. */
    interface IGetUserInfoReq {

        /** GetUserInfoReq requestId */
        requestId?: (string|null);

        /** GetUserInfoReq userId */
        userId?: (string|null);

        /** GetUserInfoReq sessionId */
        sessionId?: (string|null);
    }

    /** Represents a GetUserInfoReq. */
    class GetUserInfoReq implements IGetUserInfoReq {

        /**
         * Constructs a new GetUserInfoReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetUserInfoReq);

        /** GetUserInfoReq requestId. */
        public requestId: string;

        /** GetUserInfoReq userId. */
        public userId?: (string|null);

        /** GetUserInfoReq sessionId. */
        public sessionId?: (string|null);

        /**
         * Creates a new GetUserInfoReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetUserInfoReq instance
         */
        public static create(properties?: im_server.IGetUserInfoReq): im_server.GetUserInfoReq;

        /**
         * Encodes the specified GetUserInfoReq message. Does not implicitly {@link im_server.GetUserInfoReq.verify|verify} messages.
         * @param message GetUserInfoReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetUserInfoReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetUserInfoReq message, length delimited. Does not implicitly {@link im_server.GetUserInfoReq.verify|verify} messages.
         * @param message GetUserInfoReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetUserInfoReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetUserInfoReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetUserInfoReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetUserInfoReq;

        /**
         * Decodes a GetUserInfoReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetUserInfoReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetUserInfoReq;

        /**
         * Verifies a GetUserInfoReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetUserInfoReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetUserInfoReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetUserInfoReq;

        /**
         * Creates a plain object from a GetUserInfoReq message. Also converts values to other types if specified.
         * @param message GetUserInfoReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetUserInfoReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetUserInfoReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetUserInfoReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetUserInfoRsp. */
    interface IGetUserInfoRsp {

        /** GetUserInfoRsp requestId */
        requestId?: (string|null);

        /** GetUserInfoRsp success */
        success?: (boolean|null);

        /** GetUserInfoRsp errmsg */
        errmsg?: (string|null);

        /** GetUserInfoRsp userInfo */
        userInfo?: (im_server.IUserInfo|null);
    }

    /** Represents a GetUserInfoRsp. */
    class GetUserInfoRsp implements IGetUserInfoRsp {

        /**
         * Constructs a new GetUserInfoRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetUserInfoRsp);

        /** GetUserInfoRsp requestId. */
        public requestId: string;

        /** GetUserInfoRsp success. */
        public success: boolean;

        /** GetUserInfoRsp errmsg. */
        public errmsg: string;

        /** GetUserInfoRsp userInfo. */
        public userInfo?: (im_server.IUserInfo|null);

        /**
         * Creates a new GetUserInfoRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetUserInfoRsp instance
         */
        public static create(properties?: im_server.IGetUserInfoRsp): im_server.GetUserInfoRsp;

        /**
         * Encodes the specified GetUserInfoRsp message. Does not implicitly {@link im_server.GetUserInfoRsp.verify|verify} messages.
         * @param message GetUserInfoRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetUserInfoRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetUserInfoRsp message, length delimited. Does not implicitly {@link im_server.GetUserInfoRsp.verify|verify} messages.
         * @param message GetUserInfoRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetUserInfoRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetUserInfoRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetUserInfoRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetUserInfoRsp;

        /**
         * Decodes a GetUserInfoRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetUserInfoRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetUserInfoRsp;

        /**
         * Verifies a GetUserInfoRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetUserInfoRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetUserInfoRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetUserInfoRsp;

        /**
         * Creates a plain object from a GetUserInfoRsp message. Also converts values to other types if specified.
         * @param message GetUserInfoRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetUserInfoRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetUserInfoRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetUserInfoRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetMultiUserInfoReq. */
    interface IGetMultiUserInfoReq {

        /** GetMultiUserInfoReq requestId */
        requestId?: (string|null);

        /** GetMultiUserInfoReq usersId */
        usersId?: (string[]|null);
    }

    /** Represents a GetMultiUserInfoReq. */
    class GetMultiUserInfoReq implements IGetMultiUserInfoReq {

        /**
         * Constructs a new GetMultiUserInfoReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetMultiUserInfoReq);

        /** GetMultiUserInfoReq requestId. */
        public requestId: string;

        /** GetMultiUserInfoReq usersId. */
        public usersId: string[];

        /**
         * Creates a new GetMultiUserInfoReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetMultiUserInfoReq instance
         */
        public static create(properties?: im_server.IGetMultiUserInfoReq): im_server.GetMultiUserInfoReq;

        /**
         * Encodes the specified GetMultiUserInfoReq message. Does not implicitly {@link im_server.GetMultiUserInfoReq.verify|verify} messages.
         * @param message GetMultiUserInfoReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetMultiUserInfoReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetMultiUserInfoReq message, length delimited. Does not implicitly {@link im_server.GetMultiUserInfoReq.verify|verify} messages.
         * @param message GetMultiUserInfoReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetMultiUserInfoReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetMultiUserInfoReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetMultiUserInfoReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetMultiUserInfoReq;

        /**
         * Decodes a GetMultiUserInfoReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetMultiUserInfoReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetMultiUserInfoReq;

        /**
         * Verifies a GetMultiUserInfoReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetMultiUserInfoReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetMultiUserInfoReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetMultiUserInfoReq;

        /**
         * Creates a plain object from a GetMultiUserInfoReq message. Also converts values to other types if specified.
         * @param message GetMultiUserInfoReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetMultiUserInfoReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetMultiUserInfoReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetMultiUserInfoReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetMultiUserInfoRsp. */
    interface IGetMultiUserInfoRsp {

        /** GetMultiUserInfoRsp requestId */
        requestId?: (string|null);

        /** GetMultiUserInfoRsp success */
        success?: (boolean|null);

        /** GetMultiUserInfoRsp errmsg */
        errmsg?: (string|null);

        /** GetMultiUserInfoRsp usersInfo */
        usersInfo?: ({ [k: string]: im_server.IUserInfo }|null);
    }

    /** Represents a GetMultiUserInfoRsp. */
    class GetMultiUserInfoRsp implements IGetMultiUserInfoRsp {

        /**
         * Constructs a new GetMultiUserInfoRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.IGetMultiUserInfoRsp);

        /** GetMultiUserInfoRsp requestId. */
        public requestId: string;

        /** GetMultiUserInfoRsp success. */
        public success: boolean;

        /** GetMultiUserInfoRsp errmsg. */
        public errmsg: string;

        /** GetMultiUserInfoRsp usersInfo. */
        public usersInfo: { [k: string]: im_server.IUserInfo };

        /**
         * Creates a new GetMultiUserInfoRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetMultiUserInfoRsp instance
         */
        public static create(properties?: im_server.IGetMultiUserInfoRsp): im_server.GetMultiUserInfoRsp;

        /**
         * Encodes the specified GetMultiUserInfoRsp message. Does not implicitly {@link im_server.GetMultiUserInfoRsp.verify|verify} messages.
         * @param message GetMultiUserInfoRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.IGetMultiUserInfoRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetMultiUserInfoRsp message, length delimited. Does not implicitly {@link im_server.GetMultiUserInfoRsp.verify|verify} messages.
         * @param message GetMultiUserInfoRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.IGetMultiUserInfoRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetMultiUserInfoRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetMultiUserInfoRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.GetMultiUserInfoRsp;

        /**
         * Decodes a GetMultiUserInfoRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetMultiUserInfoRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.GetMultiUserInfoRsp;

        /**
         * Verifies a GetMultiUserInfoRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetMultiUserInfoRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetMultiUserInfoRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.GetMultiUserInfoRsp;

        /**
         * Creates a plain object from a GetMultiUserInfoRsp message. Also converts values to other types if specified.
         * @param message GetMultiUserInfoRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.GetMultiUserInfoRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetMultiUserInfoRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetMultiUserInfoRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SetUserAvatarReq. */
    interface ISetUserAvatarReq {

        /** SetUserAvatarReq requestId */
        requestId?: (string|null);

        /** SetUserAvatarReq userId */
        userId?: (string|null);

        /** SetUserAvatarReq sessionId */
        sessionId?: (string|null);

        /** SetUserAvatarReq avatar */
        avatar?: (Uint8Array|null);
    }

    /** Represents a SetUserAvatarReq. */
    class SetUserAvatarReq implements ISetUserAvatarReq {

        /**
         * Constructs a new SetUserAvatarReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.ISetUserAvatarReq);

        /** SetUserAvatarReq requestId. */
        public requestId: string;

        /** SetUserAvatarReq userId. */
        public userId?: (string|null);

        /** SetUserAvatarReq sessionId. */
        public sessionId?: (string|null);

        /** SetUserAvatarReq avatar. */
        public avatar: Uint8Array;

        /**
         * Creates a new SetUserAvatarReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SetUserAvatarReq instance
         */
        public static create(properties?: im_server.ISetUserAvatarReq): im_server.SetUserAvatarReq;

        /**
         * Encodes the specified SetUserAvatarReq message. Does not implicitly {@link im_server.SetUserAvatarReq.verify|verify} messages.
         * @param message SetUserAvatarReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.ISetUserAvatarReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SetUserAvatarReq message, length delimited. Does not implicitly {@link im_server.SetUserAvatarReq.verify|verify} messages.
         * @param message SetUserAvatarReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.ISetUserAvatarReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SetUserAvatarReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SetUserAvatarReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.SetUserAvatarReq;

        /**
         * Decodes a SetUserAvatarReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SetUserAvatarReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.SetUserAvatarReq;

        /**
         * Verifies a SetUserAvatarReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SetUserAvatarReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SetUserAvatarReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.SetUserAvatarReq;

        /**
         * Creates a plain object from a SetUserAvatarReq message. Also converts values to other types if specified.
         * @param message SetUserAvatarReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.SetUserAvatarReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SetUserAvatarReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SetUserAvatarReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SetUserAvatarRsp. */
    interface ISetUserAvatarRsp {

        /** SetUserAvatarRsp requestId */
        requestId?: (string|null);

        /** SetUserAvatarRsp success */
        success?: (boolean|null);

        /** SetUserAvatarRsp errmsg */
        errmsg?: (string|null);
    }

    /** Represents a SetUserAvatarRsp. */
    class SetUserAvatarRsp implements ISetUserAvatarRsp {

        /**
         * Constructs a new SetUserAvatarRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.ISetUserAvatarRsp);

        /** SetUserAvatarRsp requestId. */
        public requestId: string;

        /** SetUserAvatarRsp success. */
        public success: boolean;

        /** SetUserAvatarRsp errmsg. */
        public errmsg: string;

        /**
         * Creates a new SetUserAvatarRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SetUserAvatarRsp instance
         */
        public static create(properties?: im_server.ISetUserAvatarRsp): im_server.SetUserAvatarRsp;

        /**
         * Encodes the specified SetUserAvatarRsp message. Does not implicitly {@link im_server.SetUserAvatarRsp.verify|verify} messages.
         * @param message SetUserAvatarRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.ISetUserAvatarRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SetUserAvatarRsp message, length delimited. Does not implicitly {@link im_server.SetUserAvatarRsp.verify|verify} messages.
         * @param message SetUserAvatarRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.ISetUserAvatarRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SetUserAvatarRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SetUserAvatarRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.SetUserAvatarRsp;

        /**
         * Decodes a SetUserAvatarRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SetUserAvatarRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.SetUserAvatarRsp;

        /**
         * Verifies a SetUserAvatarRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SetUserAvatarRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SetUserAvatarRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.SetUserAvatarRsp;

        /**
         * Creates a plain object from a SetUserAvatarRsp message. Also converts values to other types if specified.
         * @param message SetUserAvatarRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.SetUserAvatarRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SetUserAvatarRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SetUserAvatarRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SetUserNicknameReq. */
    interface ISetUserNicknameReq {

        /** SetUserNicknameReq requestId */
        requestId?: (string|null);

        /** SetUserNicknameReq userId */
        userId?: (string|null);

        /** SetUserNicknameReq sessionId */
        sessionId?: (string|null);

        /** SetUserNicknameReq nickname */
        nickname?: (string|null);
    }

    /** Represents a SetUserNicknameReq. */
    class SetUserNicknameReq implements ISetUserNicknameReq {

        /**
         * Constructs a new SetUserNicknameReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.ISetUserNicknameReq);

        /** SetUserNicknameReq requestId. */
        public requestId: string;

        /** SetUserNicknameReq userId. */
        public userId?: (string|null);

        /** SetUserNicknameReq sessionId. */
        public sessionId?: (string|null);

        /** SetUserNicknameReq nickname. */
        public nickname: string;

        /**
         * Creates a new SetUserNicknameReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SetUserNicknameReq instance
         */
        public static create(properties?: im_server.ISetUserNicknameReq): im_server.SetUserNicknameReq;

        /**
         * Encodes the specified SetUserNicknameReq message. Does not implicitly {@link im_server.SetUserNicknameReq.verify|verify} messages.
         * @param message SetUserNicknameReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.ISetUserNicknameReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SetUserNicknameReq message, length delimited. Does not implicitly {@link im_server.SetUserNicknameReq.verify|verify} messages.
         * @param message SetUserNicknameReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.ISetUserNicknameReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SetUserNicknameReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SetUserNicknameReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.SetUserNicknameReq;

        /**
         * Decodes a SetUserNicknameReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SetUserNicknameReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.SetUserNicknameReq;

        /**
         * Verifies a SetUserNicknameReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SetUserNicknameReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SetUserNicknameReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.SetUserNicknameReq;

        /**
         * Creates a plain object from a SetUserNicknameReq message. Also converts values to other types if specified.
         * @param message SetUserNicknameReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.SetUserNicknameReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SetUserNicknameReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SetUserNicknameReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SetUserNicknameRsp. */
    interface ISetUserNicknameRsp {

        /** SetUserNicknameRsp requestId */
        requestId?: (string|null);

        /** SetUserNicknameRsp success */
        success?: (boolean|null);

        /** SetUserNicknameRsp errmsg */
        errmsg?: (string|null);
    }

    /** Represents a SetUserNicknameRsp. */
    class SetUserNicknameRsp implements ISetUserNicknameRsp {

        /**
         * Constructs a new SetUserNicknameRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.ISetUserNicknameRsp);

        /** SetUserNicknameRsp requestId. */
        public requestId: string;

        /** SetUserNicknameRsp success. */
        public success: boolean;

        /** SetUserNicknameRsp errmsg. */
        public errmsg: string;

        /**
         * Creates a new SetUserNicknameRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SetUserNicknameRsp instance
         */
        public static create(properties?: im_server.ISetUserNicknameRsp): im_server.SetUserNicknameRsp;

        /**
         * Encodes the specified SetUserNicknameRsp message. Does not implicitly {@link im_server.SetUserNicknameRsp.verify|verify} messages.
         * @param message SetUserNicknameRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.ISetUserNicknameRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SetUserNicknameRsp message, length delimited. Does not implicitly {@link im_server.SetUserNicknameRsp.verify|verify} messages.
         * @param message SetUserNicknameRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.ISetUserNicknameRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SetUserNicknameRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SetUserNicknameRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.SetUserNicknameRsp;

        /**
         * Decodes a SetUserNicknameRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SetUserNicknameRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.SetUserNicknameRsp;

        /**
         * Verifies a SetUserNicknameRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SetUserNicknameRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SetUserNicknameRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.SetUserNicknameRsp;

        /**
         * Creates a plain object from a SetUserNicknameRsp message. Also converts values to other types if specified.
         * @param message SetUserNicknameRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.SetUserNicknameRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SetUserNicknameRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SetUserNicknameRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SetUserDescriptionReq. */
    interface ISetUserDescriptionReq {

        /** SetUserDescriptionReq requestId */
        requestId?: (string|null);

        /** SetUserDescriptionReq userId */
        userId?: (string|null);

        /** SetUserDescriptionReq sessionId */
        sessionId?: (string|null);

        /** SetUserDescriptionReq description */
        description?: (string|null);
    }

    /** Represents a SetUserDescriptionReq. */
    class SetUserDescriptionReq implements ISetUserDescriptionReq {

        /**
         * Constructs a new SetUserDescriptionReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.ISetUserDescriptionReq);

        /** SetUserDescriptionReq requestId. */
        public requestId: string;

        /** SetUserDescriptionReq userId. */
        public userId?: (string|null);

        /** SetUserDescriptionReq sessionId. */
        public sessionId?: (string|null);

        /** SetUserDescriptionReq description. */
        public description: string;

        /**
         * Creates a new SetUserDescriptionReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SetUserDescriptionReq instance
         */
        public static create(properties?: im_server.ISetUserDescriptionReq): im_server.SetUserDescriptionReq;

        /**
         * Encodes the specified SetUserDescriptionReq message. Does not implicitly {@link im_server.SetUserDescriptionReq.verify|verify} messages.
         * @param message SetUserDescriptionReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.ISetUserDescriptionReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SetUserDescriptionReq message, length delimited. Does not implicitly {@link im_server.SetUserDescriptionReq.verify|verify} messages.
         * @param message SetUserDescriptionReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.ISetUserDescriptionReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SetUserDescriptionReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SetUserDescriptionReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.SetUserDescriptionReq;

        /**
         * Decodes a SetUserDescriptionReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SetUserDescriptionReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.SetUserDescriptionReq;

        /**
         * Verifies a SetUserDescriptionReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SetUserDescriptionReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SetUserDescriptionReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.SetUserDescriptionReq;

        /**
         * Creates a plain object from a SetUserDescriptionReq message. Also converts values to other types if specified.
         * @param message SetUserDescriptionReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.SetUserDescriptionReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SetUserDescriptionReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SetUserDescriptionReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SetUserDescriptionRsp. */
    interface ISetUserDescriptionRsp {

        /** SetUserDescriptionRsp requestId */
        requestId?: (string|null);

        /** SetUserDescriptionRsp success */
        success?: (boolean|null);

        /** SetUserDescriptionRsp errmsg */
        errmsg?: (string|null);
    }

    /** Represents a SetUserDescriptionRsp. */
    class SetUserDescriptionRsp implements ISetUserDescriptionRsp {

        /**
         * Constructs a new SetUserDescriptionRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.ISetUserDescriptionRsp);

        /** SetUserDescriptionRsp requestId. */
        public requestId: string;

        /** SetUserDescriptionRsp success. */
        public success: boolean;

        /** SetUserDescriptionRsp errmsg. */
        public errmsg: string;

        /**
         * Creates a new SetUserDescriptionRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SetUserDescriptionRsp instance
         */
        public static create(properties?: im_server.ISetUserDescriptionRsp): im_server.SetUserDescriptionRsp;

        /**
         * Encodes the specified SetUserDescriptionRsp message. Does not implicitly {@link im_server.SetUserDescriptionRsp.verify|verify} messages.
         * @param message SetUserDescriptionRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.ISetUserDescriptionRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SetUserDescriptionRsp message, length delimited. Does not implicitly {@link im_server.SetUserDescriptionRsp.verify|verify} messages.
         * @param message SetUserDescriptionRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.ISetUserDescriptionRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SetUserDescriptionRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SetUserDescriptionRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.SetUserDescriptionRsp;

        /**
         * Decodes a SetUserDescriptionRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SetUserDescriptionRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.SetUserDescriptionRsp;

        /**
         * Verifies a SetUserDescriptionRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SetUserDescriptionRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SetUserDescriptionRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.SetUserDescriptionRsp;

        /**
         * Creates a plain object from a SetUserDescriptionRsp message. Also converts values to other types if specified.
         * @param message SetUserDescriptionRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.SetUserDescriptionRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SetUserDescriptionRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SetUserDescriptionRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SetUserPhoneNumberReq. */
    interface ISetUserPhoneNumberReq {

        /** SetUserPhoneNumberReq requestId */
        requestId?: (string|null);

        /** SetUserPhoneNumberReq userId */
        userId?: (string|null);

        /** SetUserPhoneNumberReq sessionId */
        sessionId?: (string|null);

        /** SetUserPhoneNumberReq phoneNumber */
        phoneNumber?: (string|null);

        /** SetUserPhoneNumberReq phoneVerifyCodeId */
        phoneVerifyCodeId?: (string|null);

        /** SetUserPhoneNumberReq phoneVerifyCode */
        phoneVerifyCode?: (string|null);
    }

    /** Represents a SetUserPhoneNumberReq. */
    class SetUserPhoneNumberReq implements ISetUserPhoneNumberReq {

        /**
         * Constructs a new SetUserPhoneNumberReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.ISetUserPhoneNumberReq);

        /** SetUserPhoneNumberReq requestId. */
        public requestId: string;

        /** SetUserPhoneNumberReq userId. */
        public userId?: (string|null);

        /** SetUserPhoneNumberReq sessionId. */
        public sessionId?: (string|null);

        /** SetUserPhoneNumberReq phoneNumber. */
        public phoneNumber: string;

        /** SetUserPhoneNumberReq phoneVerifyCodeId. */
        public phoneVerifyCodeId: string;

        /** SetUserPhoneNumberReq phoneVerifyCode. */
        public phoneVerifyCode: string;

        /**
         * Creates a new SetUserPhoneNumberReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SetUserPhoneNumberReq instance
         */
        public static create(properties?: im_server.ISetUserPhoneNumberReq): im_server.SetUserPhoneNumberReq;

        /**
         * Encodes the specified SetUserPhoneNumberReq message. Does not implicitly {@link im_server.SetUserPhoneNumberReq.verify|verify} messages.
         * @param message SetUserPhoneNumberReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.ISetUserPhoneNumberReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SetUserPhoneNumberReq message, length delimited. Does not implicitly {@link im_server.SetUserPhoneNumberReq.verify|verify} messages.
         * @param message SetUserPhoneNumberReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.ISetUserPhoneNumberReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SetUserPhoneNumberReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SetUserPhoneNumberReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.SetUserPhoneNumberReq;

        /**
         * Decodes a SetUserPhoneNumberReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SetUserPhoneNumberReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.SetUserPhoneNumberReq;

        /**
         * Verifies a SetUserPhoneNumberReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SetUserPhoneNumberReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SetUserPhoneNumberReq
         */
        public static fromObject(object: { [k: string]: any }): im_server.SetUserPhoneNumberReq;

        /**
         * Creates a plain object from a SetUserPhoneNumberReq message. Also converts values to other types if specified.
         * @param message SetUserPhoneNumberReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.SetUserPhoneNumberReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SetUserPhoneNumberReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SetUserPhoneNumberReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SetUserPhoneNumberRsp. */
    interface ISetUserPhoneNumberRsp {

        /** SetUserPhoneNumberRsp requestId */
        requestId?: (string|null);

        /** SetUserPhoneNumberRsp success */
        success?: (boolean|null);

        /** SetUserPhoneNumberRsp errmsg */
        errmsg?: (string|null);
    }

    /** Represents a SetUserPhoneNumberRsp. */
    class SetUserPhoneNumberRsp implements ISetUserPhoneNumberRsp {

        /**
         * Constructs a new SetUserPhoneNumberRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: im_server.ISetUserPhoneNumberRsp);

        /** SetUserPhoneNumberRsp requestId. */
        public requestId: string;

        /** SetUserPhoneNumberRsp success. */
        public success: boolean;

        /** SetUserPhoneNumberRsp errmsg. */
        public errmsg: string;

        /**
         * Creates a new SetUserPhoneNumberRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SetUserPhoneNumberRsp instance
         */
        public static create(properties?: im_server.ISetUserPhoneNumberRsp): im_server.SetUserPhoneNumberRsp;

        /**
         * Encodes the specified SetUserPhoneNumberRsp message. Does not implicitly {@link im_server.SetUserPhoneNumberRsp.verify|verify} messages.
         * @param message SetUserPhoneNumberRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: im_server.ISetUserPhoneNumberRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SetUserPhoneNumberRsp message, length delimited. Does not implicitly {@link im_server.SetUserPhoneNumberRsp.verify|verify} messages.
         * @param message SetUserPhoneNumberRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: im_server.ISetUserPhoneNumberRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SetUserPhoneNumberRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SetUserPhoneNumberRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): im_server.SetUserPhoneNumberRsp;

        /**
         * Decodes a SetUserPhoneNumberRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SetUserPhoneNumberRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): im_server.SetUserPhoneNumberRsp;

        /**
         * Verifies a SetUserPhoneNumberRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SetUserPhoneNumberRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SetUserPhoneNumberRsp
         */
        public static fromObject(object: { [k: string]: any }): im_server.SetUserPhoneNumberRsp;

        /**
         * Creates a plain object from a SetUserPhoneNumberRsp message. Also converts values to other types if specified.
         * @param message SetUserPhoneNumberRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: im_server.SetUserPhoneNumberRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SetUserPhoneNumberRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SetUserPhoneNumberRsp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Represents a UserService */
    class UserService extends $protobuf.rpc.Service {

        /**
         * Constructs a new UserService service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new UserService service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): UserService;

        /**
         * Calls UserRegister.
         * @param request UserRegisterReq message or plain object
         * @param callback Node-style callback called with the error, if any, and UserRegisterRsp
         */
        public userRegister(request: im_server.IUserRegisterReq, callback: im_server.UserService.UserRegisterCallback): void;

        /**
         * Calls UserRegister.
         * @param request UserRegisterReq message or plain object
         * @returns Promise
         */
        public userRegister(request: im_server.IUserRegisterReq): Promise<im_server.UserRegisterRsp>;

        /**
         * Calls UserLogin.
         * @param request UserLoginReq message or plain object
         * @param callback Node-style callback called with the error, if any, and UserLoginRsp
         */
        public userLogin(request: im_server.IUserLoginReq, callback: im_server.UserService.UserLoginCallback): void;

        /**
         * Calls UserLogin.
         * @param request UserLoginReq message or plain object
         * @returns Promise
         */
        public userLogin(request: im_server.IUserLoginReq): Promise<im_server.UserLoginRsp>;

        /**
         * Calls GetPhoneVerifyCode.
         * @param request PhoneVerifyCodeReq message or plain object
         * @param callback Node-style callback called with the error, if any, and PhoneVerifyCodeRsp
         */
        public getPhoneVerifyCode(request: im_server.IPhoneVerifyCodeReq, callback: im_server.UserService.GetPhoneVerifyCodeCallback): void;

        /**
         * Calls GetPhoneVerifyCode.
         * @param request PhoneVerifyCodeReq message or plain object
         * @returns Promise
         */
        public getPhoneVerifyCode(request: im_server.IPhoneVerifyCodeReq): Promise<im_server.PhoneVerifyCodeRsp>;

        /**
         * Calls PhoneRegister.
         * @param request PhoneRegisterReq message or plain object
         * @param callback Node-style callback called with the error, if any, and PhoneRegisterRsp
         */
        public phoneRegister(request: im_server.IPhoneRegisterReq, callback: im_server.UserService.PhoneRegisterCallback): void;

        /**
         * Calls PhoneRegister.
         * @param request PhoneRegisterReq message or plain object
         * @returns Promise
         */
        public phoneRegister(request: im_server.IPhoneRegisterReq): Promise<im_server.PhoneRegisterRsp>;

        /**
         * Calls PhoneLogin.
         * @param request PhoneLoginReq message or plain object
         * @param callback Node-style callback called with the error, if any, and PhoneLoginRsp
         */
        public phoneLogin(request: im_server.IPhoneLoginReq, callback: im_server.UserService.PhoneLoginCallback): void;

        /**
         * Calls PhoneLogin.
         * @param request PhoneLoginReq message or plain object
         * @returns Promise
         */
        public phoneLogin(request: im_server.IPhoneLoginReq): Promise<im_server.PhoneLoginRsp>;

        /**
         * Calls GetUserInfo.
         * @param request GetUserInfoReq message or plain object
         * @param callback Node-style callback called with the error, if any, and GetUserInfoRsp
         */
        public getUserInfo(request: im_server.IGetUserInfoReq, callback: im_server.UserService.GetUserInfoCallback): void;

        /**
         * Calls GetUserInfo.
         * @param request GetUserInfoReq message or plain object
         * @returns Promise
         */
        public getUserInfo(request: im_server.IGetUserInfoReq): Promise<im_server.GetUserInfoRsp>;

        /**
         * Calls GetMultiUserInfo.
         * @param request GetMultiUserInfoReq message or plain object
         * @param callback Node-style callback called with the error, if any, and GetMultiUserInfoRsp
         */
        public getMultiUserInfo(request: im_server.IGetMultiUserInfoReq, callback: im_server.UserService.GetMultiUserInfoCallback): void;

        /**
         * Calls GetMultiUserInfo.
         * @param request GetMultiUserInfoReq message or plain object
         * @returns Promise
         */
        public getMultiUserInfo(request: im_server.IGetMultiUserInfoReq): Promise<im_server.GetMultiUserInfoRsp>;

        /**
         * Calls SetUserAvatar.
         * @param request SetUserAvatarReq message or plain object
         * @param callback Node-style callback called with the error, if any, and SetUserAvatarRsp
         */
        public setUserAvatar(request: im_server.ISetUserAvatarReq, callback: im_server.UserService.SetUserAvatarCallback): void;

        /**
         * Calls SetUserAvatar.
         * @param request SetUserAvatarReq message or plain object
         * @returns Promise
         */
        public setUserAvatar(request: im_server.ISetUserAvatarReq): Promise<im_server.SetUserAvatarRsp>;

        /**
         * Calls SetUserNickname.
         * @param request SetUserNicknameReq message or plain object
         * @param callback Node-style callback called with the error, if any, and SetUserNicknameRsp
         */
        public setUserNickname(request: im_server.ISetUserNicknameReq, callback: im_server.UserService.SetUserNicknameCallback): void;

        /**
         * Calls SetUserNickname.
         * @param request SetUserNicknameReq message or plain object
         * @returns Promise
         */
        public setUserNickname(request: im_server.ISetUserNicknameReq): Promise<im_server.SetUserNicknameRsp>;

        /**
         * Calls SetUserDescription.
         * @param request SetUserDescriptionReq message or plain object
         * @param callback Node-style callback called with the error, if any, and SetUserDescriptionRsp
         */
        public setUserDescription(request: im_server.ISetUserDescriptionReq, callback: im_server.UserService.SetUserDescriptionCallback): void;

        /**
         * Calls SetUserDescription.
         * @param request SetUserDescriptionReq message or plain object
         * @returns Promise
         */
        public setUserDescription(request: im_server.ISetUserDescriptionReq): Promise<im_server.SetUserDescriptionRsp>;

        /**
         * Calls SetUserPhoneNumber.
         * @param request SetUserPhoneNumberReq message or plain object
         * @param callback Node-style callback called with the error, if any, and SetUserPhoneNumberRsp
         */
        public setUserPhoneNumber(request: im_server.ISetUserPhoneNumberReq, callback: im_server.UserService.SetUserPhoneNumberCallback): void;

        /**
         * Calls SetUserPhoneNumber.
         * @param request SetUserPhoneNumberReq message or plain object
         * @returns Promise
         */
        public setUserPhoneNumber(request: im_server.ISetUserPhoneNumberReq): Promise<im_server.SetUserPhoneNumberRsp>;
    }

    namespace UserService {

        /**
         * Callback as used by {@link im_server.UserService#userRegister}.
         * @param error Error, if any
         * @param [response] UserRegisterRsp
         */
        type UserRegisterCallback = (error: (Error|null), response?: im_server.UserRegisterRsp) => void;

        /**
         * Callback as used by {@link im_server.UserService#userLogin}.
         * @param error Error, if any
         * @param [response] UserLoginRsp
         */
        type UserLoginCallback = (error: (Error|null), response?: im_server.UserLoginRsp) => void;

        /**
         * Callback as used by {@link im_server.UserService#getPhoneVerifyCode}.
         * @param error Error, if any
         * @param [response] PhoneVerifyCodeRsp
         */
        type GetPhoneVerifyCodeCallback = (error: (Error|null), response?: im_server.PhoneVerifyCodeRsp) => void;

        /**
         * Callback as used by {@link im_server.UserService#phoneRegister}.
         * @param error Error, if any
         * @param [response] PhoneRegisterRsp
         */
        type PhoneRegisterCallback = (error: (Error|null), response?: im_server.PhoneRegisterRsp) => void;

        /**
         * Callback as used by {@link im_server.UserService#phoneLogin}.
         * @param error Error, if any
         * @param [response] PhoneLoginRsp
         */
        type PhoneLoginCallback = (error: (Error|null), response?: im_server.PhoneLoginRsp) => void;

        /**
         * Callback as used by {@link im_server.UserService#getUserInfo}.
         * @param error Error, if any
         * @param [response] GetUserInfoRsp
         */
        type GetUserInfoCallback = (error: (Error|null), response?: im_server.GetUserInfoRsp) => void;

        /**
         * Callback as used by {@link im_server.UserService#getMultiUserInfo}.
         * @param error Error, if any
         * @param [response] GetMultiUserInfoRsp
         */
        type GetMultiUserInfoCallback = (error: (Error|null), response?: im_server.GetMultiUserInfoRsp) => void;

        /**
         * Callback as used by {@link im_server.UserService#setUserAvatar}.
         * @param error Error, if any
         * @param [response] SetUserAvatarRsp
         */
        type SetUserAvatarCallback = (error: (Error|null), response?: im_server.SetUserAvatarRsp) => void;

        /**
         * Callback as used by {@link im_server.UserService#setUserNickname}.
         * @param error Error, if any
         * @param [response] SetUserNicknameRsp
         */
        type SetUserNicknameCallback = (error: (Error|null), response?: im_server.SetUserNicknameRsp) => void;

        /**
         * Callback as used by {@link im_server.UserService#setUserDescription}.
         * @param error Error, if any
         * @param [response] SetUserDescriptionRsp
         */
        type SetUserDescriptionCallback = (error: (Error|null), response?: im_server.SetUserDescriptionRsp) => void;

        /**
         * Callback as used by {@link im_server.UserService#setUserPhoneNumber}.
         * @param error Error, if any
         * @param [response] SetUserPhoneNumberRsp
         */
        type SetUserPhoneNumberCallback = (error: (Error|null), response?: im_server.SetUserPhoneNumberRsp) => void;
    }
}
