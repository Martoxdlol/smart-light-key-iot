class WifiNetwork {
  public:
    String ssid;
    String password;
    int rssi;
    String code;
    bool isDevice;
    bool matchOk;
    char connectionStatus;
    WifiNetwork(String _ssid, String _password, int _rssi, String _code, bool _isDevice, bool _matchOk, char _connectionStatus);
    WifiNetwork();
    String toString();
    char * ssidCharArray();
};

WifiNetwork matchWifiName(String str);

String makeid(int len);

String makeid();

void updateOutputs();

void spreadWifiCredentials();

void spreadLoop();

void markSpreadWifiCredentialsRequired();

extern unsigned long spreadWifiCredentialsMS;

extern bool spreadWifiCredentialsRequired;