class Command{
    public:
        String content;
        String to;
        String from;
        String hash;
        String command;
        String commandID;
        bool isJson;
        Command(String command, String content);
        Command(String _command, String _content, String _to, String _from, String _hash);
        Command(String _command, String _content, String _to, String _from, String _hash, String id);
        bool verify();
        String encode();
};

Command decodeCommand(String str);

String encodeCommand(String command,String content);

String encodeCommand(String command,String content, bool isJson);

String encodeCommand(String command,String content, String id);

String encodeCommand(String command,String content, String id, bool isJson);