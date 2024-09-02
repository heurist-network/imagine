export function HeuristIcon({
  className,
  strokeWidth = 2,
}: {
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      className={className}
      // width="1440"
      // height="376"
      viewBox="0 0 1440 376"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M47.1292 179.213V293.446H0L2.19472e-07 25.2473L47.1292 25.2473V139.066L231.926 139.066L231.926 25.2473L278.641 25.2473V293.446H231.926V179.213H47.1292Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M504.398 225.57H548.633C546.429 239.642 540.916 252.196 532.097 263.233C523.553 273.995 511.84 282.548 496.957 288.894C482.074 294.965 464.297 298 443.626 298C420.199 298 399.253 293.723 380.787 285.169C362.321 276.34 347.852 263.923 337.379 247.92C326.906 231.916 321.669 212.877 321.669 190.803C321.669 169.005 326.768 149.966 336.965 133.687C347.163 117.407 361.219 104.853 379.134 96.0232C397.324 87.1936 418.27 82.7788 441.973 82.7788C466.502 82.7788 486.897 87.1936 503.158 96.0232C519.694 104.577 531.959 117.545 539.952 134.929C547.945 152.036 551.252 173.696 549.874 199.909H368.385C369.763 211.498 373.484 221.983 379.547 231.364C385.886 240.47 394.43 247.644 405.179 252.886C415.927 257.853 428.468 260.336 442.799 260.336C458.785 260.336 472.152 257.163 482.901 250.817C493.925 244.471 501.091 236.055 504.398 225.57ZM440.732 120.029C421.991 120.029 406.557 124.719 394.43 134.101C382.303 143.206 374.448 154.933 370.865 169.281L503.571 169.281C502.469 153.829 496.268 141.827 484.968 133.273C473.668 124.443 458.923 120.029 440.732 120.029Z"
        fill="white"
      />
      <path
        d="M755.34 293.445H801.229V87.3297L755.34 87.3297V204.085C753.067 210.5 749.76 217.109 745.418 223.912C739.355 233.57 731.224 241.71 721.027 248.332C710.829 254.954 698.427 258.265 683.82 258.265C673.622 258.265 664.665 256.747 656.948 253.712C649.23 250.677 643.167 245.572 638.757 238.398C634.623 230.948 632.556 220.739 632.556 207.771V87.3297L586.667 87.3297V216.462C586.667 232.466 589.148 245.71 594.109 256.196C599.07 266.681 605.546 274.958 613.539 281.029C621.807 287.099 630.902 291.376 640.824 293.859C651.022 296.618 661.082 297.998 671.004 297.998C684.784 297.998 696.498 295.653 706.144 290.962C715.79 285.995 723.783 279.787 730.122 272.337C736.736 264.611 741.973 256.609 745.832 248.332C749.966 239.778 752.86 231.914 754.513 224.74C754.805 223.657 755.08 222.614 755.34 221.613V293.445Z"
        fill="white"
      />
      <path
        d="M847.783 87.3315L893.672 87.3315V149.001C895.326 142.654 897.806 135.756 901.113 128.306C904.696 120.856 909.382 113.682 915.169 106.784C921.233 99.6102 928.536 93.8158 937.08 89.401C945.9 84.9862 956.235 82.7788 968.086 82.7788V126.651C953.203 126.651 940.388 129.824 929.639 136.17C919.166 142.516 910.76 150.242 904.42 159.348C899.823 165.952 896.24 172.412 893.672 178.726V293.447H847.783V87.3315Z"
        fill="white"
      />
      <path
        d="M1052.42 44.2859V0L997.435 2.40287e-06V44.2859L1052.42 44.2859Z"
        fill="white"
      />
      <path
        d="M1047.87 87.3301H1001.57V293.446H1047.87V87.3301Z"
        fill="white"
      />
      <path
        d="M1089.61 225.57L1132.19 225.57C1134.4 236.055 1140.05 244.609 1149.14 251.231C1158.24 257.577 1170.5 260.75 1185.93 260.75C1195.86 260.75 1203.57 259.646 1209.09 257.439C1214.87 255.232 1218.87 252.196 1221.07 248.334C1223.55 244.471 1224.8 240.056 1224.8 235.089C1224.8 229.019 1223 224.328 1219.42 221.017C1216.11 217.706 1211.15 214.947 1204.54 212.739C1197.92 210.532 1189.65 208.6 1179.73 206.945C1169.54 204.462 1159.48 201.702 1149.55 198.667C1139.63 195.632 1130.67 191.907 1122.68 187.492C1114.69 182.801 1108.35 177.007 1103.66 170.109C1099.25 162.935 1097.05 154.243 1097.05 144.034C1097.05 134.653 1099.12 126.237 1103.25 118.787C1107.66 111.061 1113.72 104.577 1121.44 99.3343C1129.16 94.0917 1138.25 90.0908 1148.73 87.3315C1159.2 84.2964 1170.64 82.7788 1183.04 82.7788C1200.95 82.7788 1215.84 85.676 1227.69 91.4704C1239.82 97.2648 1248.91 105.405 1254.97 115.89C1261.31 126.375 1264.48 138.378 1264.48 151.898L1223.97 151.898C1221.76 140.861 1217.49 132.859 1211.15 127.892C1204.81 122.926 1195.3 120.442 1182.63 120.442C1169.95 120.442 1160.3 122.65 1153.69 127.065C1147.07 131.479 1143.77 137.55 1143.77 145.276C1143.77 151.07 1145.83 155.761 1149.97 159.348C1154.38 162.659 1160.58 165.556 1168.57 168.039C1176.56 170.523 1185.93 173.006 1196.68 175.489C1206.6 178.249 1215.98 181.146 1224.8 184.181C1233.61 186.94 1241.47 190.527 1248.36 194.942C1255.53 199.081 1261.18 204.599 1265.31 211.498C1269.44 218.396 1271.51 226.949 1271.51 237.159C1271.51 249.851 1268.07 260.75 1261.18 269.856C1254.56 278.961 1244.91 285.997 1232.24 290.964C1219.56 295.655 1204.26 298 1186.35 298C1170.64 298 1157 296.206 1145.42 292.619C1134.12 289.032 1124.61 284.342 1116.89 278.547C1109.45 272.753 1103.66 266.545 1099.53 259.922C1095.4 253.3 1092.5 246.954 1090.85 240.884C1089.47 234.813 1089.06 229.709 1089.61 225.57Z"
        fill="white"
      />
      <path
        d="M1294.48 87.3302L1344.09 87.3302V31.8694L1390.39 31.8694V87.3302H1440V124.994H1390.39L1390.39 293.446H1344.09V124.994L1294.48 124.994V87.3302Z"
        fill="white"
      />
      <g opacity="0.6" clipPath="url(#clip0_8002_19825)">
        <path
          d="M47.1292 205.213V319.446H0L2.19472e-07 51.2473L47.1292 51.2473V165.066L231.926 165.066L231.926 51.2473L278.641 51.2473V319.446H231.926V205.213H47.1292Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M504.398 251.57H548.633C546.429 265.642 540.916 278.196 532.097 289.233C523.553 299.995 511.84 308.548 496.957 314.894C482.074 320.965 464.297 324 443.626 324C420.199 324 399.253 319.723 380.787 311.169C362.321 302.34 347.852 289.923 337.379 273.92C326.906 257.916 321.669 238.877 321.669 216.803C321.669 195.005 326.768 175.966 336.965 159.687C347.163 143.407 361.219 130.853 379.134 122.023C397.324 113.194 418.27 108.779 441.973 108.779C466.502 108.779 486.897 113.194 503.158 122.023C519.694 130.577 531.959 143.545 539.952 160.929C547.945 178.036 551.252 199.696 549.874 225.909H368.385C369.763 237.498 373.484 247.983 379.547 257.364C385.886 266.47 394.43 273.644 405.179 278.886C415.927 283.853 428.468 286.336 442.799 286.336C458.785 286.336 472.152 283.163 482.901 276.817C493.925 270.471 501.091 262.055 504.398 251.57ZM440.732 146.029C421.991 146.029 406.557 150.719 394.43 160.101C382.303 169.206 374.448 180.933 370.865 195.281L503.571 195.281C502.469 179.829 496.268 167.827 484.968 159.273C473.668 150.443 458.923 146.029 440.732 146.029Z"
          fill="white"
        />
        <path
          d="M755.34 319.445H801.229V113.33L755.34 113.33V230.085C753.067 236.5 749.76 243.109 745.418 249.912C739.355 259.57 731.224 267.71 721.027 274.332C710.829 280.954 698.427 284.265 683.82 284.265C673.622 284.265 664.665 282.747 656.948 279.712C649.23 276.677 643.167 271.572 638.757 264.398C634.623 256.948 632.556 246.739 632.556 233.771V113.33L586.667 113.33V242.462C586.667 258.466 589.148 271.71 594.109 282.196C599.07 292.681 605.546 300.958 613.539 307.029C621.807 313.099 630.902 317.376 640.824 319.859C651.022 322.618 661.082 323.998 671.004 323.998C684.784 323.998 696.498 321.653 706.144 316.962C715.79 311.995 723.783 305.787 730.122 298.337C736.736 290.611 741.973 282.609 745.832 274.332C749.966 265.778 752.86 257.914 754.513 250.74C754.805 249.657 755.08 248.614 755.34 247.613V319.445Z"
          fill="white"
        />
        <path
          d="M847.783 113.332L893.672 113.332V175.001C895.326 168.654 897.806 161.756 901.113 154.306C904.696 146.856 909.382 139.682 915.169 132.784C921.233 125.61 928.536 119.816 937.08 115.401C945.9 110.986 956.235 108.779 968.086 108.779V152.651C953.203 152.651 940.388 155.824 929.639 162.17C919.166 168.516 910.76 176.242 904.42 185.348C899.823 191.952 896.24 198.412 893.672 204.726V319.447H847.783V113.332Z"
          fill="white"
        />
        <path
          d="M1052.42 70.2859V26L997.435 26V70.2859L1052.42 70.2859Z"
          fill="white"
        />
        <path
          d="M1047.87 113.33H1001.57V319.446H1047.87V113.33Z"
          fill="white"
        />
        <path
          d="M1089.61 251.57L1132.19 251.57C1134.4 262.055 1140.05 270.609 1149.14 277.231C1158.24 283.577 1170.5 286.75 1185.93 286.75C1195.86 286.75 1203.57 285.646 1209.09 283.439C1214.87 281.232 1218.87 278.196 1221.07 274.334C1223.55 270.471 1224.8 266.056 1224.8 261.089C1224.8 255.019 1223 250.328 1219.42 247.017C1216.11 243.706 1211.15 240.947 1204.54 238.739C1197.92 236.532 1189.65 234.6 1179.73 232.945C1169.54 230.462 1159.48 227.702 1149.55 224.667C1139.63 221.632 1130.67 217.907 1122.68 213.492C1114.69 208.801 1108.35 203.007 1103.66 196.109C1099.25 188.935 1097.05 180.243 1097.05 170.034C1097.05 160.653 1099.12 152.237 1103.25 144.787C1107.66 137.061 1113.72 130.577 1121.44 125.334C1129.16 120.092 1138.25 116.091 1148.73 113.332C1159.2 110.296 1170.64 108.779 1183.04 108.779C1200.95 108.779 1215.84 111.676 1227.69 117.47C1239.82 123.265 1248.91 131.405 1254.97 141.89C1261.31 152.375 1264.48 164.378 1264.48 177.898L1223.97 177.898C1221.76 166.861 1217.49 158.859 1211.15 153.892C1204.81 148.926 1195.3 146.442 1182.63 146.442C1169.95 146.442 1160.3 148.65 1153.69 153.065C1147.07 157.479 1143.77 163.55 1143.77 171.276C1143.77 177.07 1145.83 181.761 1149.97 185.348C1154.38 188.659 1160.58 191.556 1168.57 194.039C1176.56 196.523 1185.93 199.006 1196.68 201.489C1206.6 204.249 1215.98 207.146 1224.8 210.181C1233.61 212.94 1241.47 216.527 1248.36 220.942C1255.53 225.081 1261.18 230.599 1265.31 237.498C1269.44 244.396 1271.51 252.949 1271.51 263.159C1271.51 275.851 1268.07 286.75 1261.18 295.856C1254.56 304.961 1244.91 311.997 1232.24 316.964C1219.56 321.655 1204.26 324 1186.35 324C1170.64 324 1157 322.206 1145.42 318.619C1134.12 315.032 1124.61 310.342 1116.89 304.547C1109.45 298.753 1103.66 292.545 1099.53 285.922C1095.4 279.3 1092.5 272.954 1090.85 266.884C1089.47 260.813 1089.06 255.709 1089.61 251.57Z"
          fill="white"
        />
        <path
          d="M1294.48 113.33L1344.09 113.33V57.8694L1390.39 57.8694V113.33H1440V150.994H1390.39L1390.39 319.446H1344.09V150.994L1294.48 150.994V113.33Z"
          fill="white"
        />
      </g>
      <g opacity="0.3" clipPath="url(#clip1_8002_19825)">
        <path
          d="M47.1292 231.213V345.446H0L2.19472e-07 77.2473L47.1292 77.2473V191.066L231.926 191.066L231.926 77.2473L278.641 77.2473V345.446H231.926V231.213H47.1292Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M504.398 277.57H548.633C546.429 291.642 540.916 304.196 532.097 315.233C523.553 325.995 511.84 334.548 496.957 340.894C482.074 346.965 464.297 350 443.626 350C420.199 350 399.253 345.723 380.787 337.169C362.321 328.34 347.852 315.923 337.379 299.92C326.906 283.916 321.669 264.877 321.669 242.803C321.669 221.005 326.768 201.966 336.965 185.687C347.163 169.407 361.219 156.853 379.134 148.023C397.324 139.194 418.27 134.779 441.973 134.779C466.502 134.779 486.897 139.194 503.158 148.023C519.694 156.577 531.959 169.545 539.952 186.929C547.945 204.036 551.252 225.696 549.874 251.909H368.385C369.763 263.498 373.484 273.983 379.547 283.364C385.886 292.47 394.43 299.644 405.179 304.886C415.927 309.853 428.468 312.336 442.799 312.336C458.785 312.336 472.152 309.163 482.901 302.817C493.925 296.471 501.091 288.055 504.398 277.57ZM440.732 172.029C421.991 172.029 406.557 176.719 394.43 186.101C382.303 195.206 374.448 206.933 370.865 221.281L503.571 221.281C502.469 205.829 496.268 193.827 484.968 185.273C473.668 176.443 458.923 172.029 440.732 172.029Z"
          fill="white"
        />
        <path
          d="M755.34 345.445H801.229V139.33L755.34 139.33V256.085C753.067 262.5 749.76 269.109 745.418 275.912C739.355 285.57 731.224 293.71 721.027 300.332C710.829 306.954 698.427 310.265 683.82 310.265C673.622 310.265 664.665 308.747 656.948 305.712C649.23 302.677 643.167 297.572 638.757 290.398C634.623 282.948 632.556 272.739 632.556 259.771V139.33L586.667 139.33V268.462C586.667 284.466 589.148 297.71 594.109 308.196C599.07 318.681 605.546 326.958 613.539 333.029C621.807 339.099 630.902 343.376 640.824 345.859C651.022 348.618 661.082 349.998 671.004 349.998C684.784 349.998 696.498 347.653 706.144 342.962C715.79 337.995 723.783 331.787 730.122 324.337C736.736 316.611 741.973 308.609 745.832 300.332C749.966 291.778 752.86 283.914 754.513 276.74C754.805 275.657 755.08 274.614 755.34 273.613V345.445Z"
          fill="white"
        />
        <path
          d="M847.783 139.332L893.672 139.332V201.001C895.326 194.654 897.806 187.756 901.113 180.306C904.696 172.856 909.382 165.682 915.169 158.784C921.233 151.61 928.536 145.816 937.08 141.401C945.9 136.986 956.235 134.779 968.086 134.779V178.651C953.203 178.651 940.388 181.824 929.639 188.17C919.166 194.516 910.76 202.242 904.42 211.348C899.823 217.952 896.24 224.412 893.672 230.726V345.447H847.783V139.332Z"
          fill="white"
        />
        <path
          d="M1052.42 96.2859V52L997.435 52V96.2859L1052.42 96.2859Z"
          fill="white"
        />
        <path
          d="M1047.87 139.33H1001.57V345.446H1047.87V139.33Z"
          fill="white"
        />
        <path
          d="M1089.61 277.57L1132.19 277.57C1134.4 288.055 1140.05 296.609 1149.14 303.231C1158.24 309.577 1170.5 312.75 1185.93 312.75C1195.86 312.75 1203.57 311.646 1209.09 309.439C1214.87 307.232 1218.87 304.196 1221.07 300.334C1223.55 296.471 1224.8 292.056 1224.8 287.089C1224.8 281.019 1223 276.328 1219.42 273.017C1216.11 269.706 1211.15 266.947 1204.54 264.739C1197.92 262.532 1189.65 260.6 1179.73 258.945C1169.54 256.462 1159.48 253.702 1149.55 250.667C1139.63 247.632 1130.67 243.907 1122.68 239.492C1114.69 234.801 1108.35 229.007 1103.66 222.109C1099.25 214.935 1097.05 206.243 1097.05 196.034C1097.05 186.653 1099.12 178.237 1103.25 170.787C1107.66 163.061 1113.72 156.577 1121.44 151.334C1129.16 146.092 1138.25 142.091 1148.73 139.332C1159.2 136.296 1170.64 134.779 1183.04 134.779C1200.95 134.779 1215.84 137.676 1227.69 143.47C1239.82 149.265 1248.91 157.405 1254.97 167.89C1261.31 178.375 1264.48 190.378 1264.48 203.898L1223.97 203.898C1221.76 192.861 1217.49 184.859 1211.15 179.892C1204.81 174.926 1195.3 172.442 1182.63 172.442C1169.95 172.442 1160.3 174.65 1153.69 179.065C1147.07 183.479 1143.77 189.55 1143.77 197.276C1143.77 203.07 1145.83 207.761 1149.97 211.348C1154.38 214.659 1160.58 217.556 1168.57 220.039C1176.56 222.523 1185.93 225.006 1196.68 227.489C1206.6 230.249 1215.98 233.146 1224.8 236.181C1233.61 238.94 1241.47 242.527 1248.36 246.942C1255.53 251.081 1261.18 256.599 1265.31 263.498C1269.44 270.396 1271.51 278.949 1271.51 289.159C1271.51 301.851 1268.07 312.75 1261.18 321.856C1254.56 330.961 1244.91 337.997 1232.24 342.964C1219.56 347.655 1204.26 350 1186.35 350C1170.64 350 1157 348.206 1145.42 344.619C1134.12 341.032 1124.61 336.342 1116.89 330.547C1109.45 324.753 1103.66 318.545 1099.53 311.922C1095.4 305.3 1092.5 298.954 1090.85 292.884C1089.47 286.813 1089.06 281.709 1089.61 277.57Z"
          fill="white"
        />
        <path
          d="M1294.48 139.33L1344.09 139.33V83.8694L1390.39 83.8694V139.33H1440V176.994H1390.39L1390.39 345.446H1344.09V176.994L1294.48 176.994V139.33Z"
          fill="white"
        />
      </g>
      <g opacity="0.1" clipPath="url(#clip2_8002_19825)">
        <path
          d="M47.1292 257.213V371.446H0L2.19472e-07 103.247L47.1292 103.247V217.066L231.926 217.066L231.926 103.247L278.641 103.247V371.446H231.926V257.213H47.1292Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M504.398 303.57H548.633C546.429 317.642 540.916 330.196 532.097 341.233C523.553 351.995 511.84 360.548 496.957 366.894C482.074 372.965 464.297 376 443.626 376C420.199 376 399.253 371.723 380.787 363.169C362.321 354.34 347.852 341.923 337.379 325.92C326.906 309.916 321.669 290.877 321.669 268.803C321.669 247.005 326.768 227.966 336.965 211.687C347.163 195.407 361.219 182.853 379.134 174.023C397.324 165.194 418.27 160.779 441.973 160.779C466.502 160.779 486.897 165.194 503.158 174.023C519.694 182.577 531.959 195.545 539.952 212.929C547.945 230.036 551.252 251.696 549.874 277.909H368.385C369.763 289.498 373.484 299.983 379.547 309.364C385.886 318.47 394.43 325.644 405.179 330.886C415.927 335.853 428.468 338.336 442.799 338.336C458.785 338.336 472.152 335.163 482.901 328.817C493.925 322.471 501.091 314.055 504.398 303.57ZM440.732 198.029C421.991 198.029 406.557 202.719 394.43 212.101C382.303 221.206 374.448 232.933 370.865 247.281L503.571 247.281C502.469 231.829 496.268 219.827 484.968 211.273C473.668 202.443 458.923 198.029 440.732 198.029Z"
          fill="white"
        />
        <path
          d="M755.34 371.445H801.229V165.33L755.34 165.33V282.085C753.067 288.5 749.76 295.109 745.418 301.912C739.355 311.57 731.224 319.71 721.027 326.332C710.829 332.954 698.427 336.265 683.82 336.265C673.622 336.265 664.665 334.747 656.948 331.712C649.23 328.677 643.167 323.572 638.757 316.398C634.623 308.948 632.556 298.739 632.556 285.771V165.33L586.667 165.33V294.462C586.667 310.466 589.148 323.71 594.109 334.196C599.07 344.681 605.546 352.958 613.539 359.029C621.807 365.099 630.902 369.376 640.824 371.859C651.022 374.618 661.082 375.998 671.004 375.998C684.784 375.998 696.498 373.653 706.144 368.962C715.79 363.995 723.783 357.787 730.122 350.337C736.736 342.611 741.973 334.609 745.832 326.332C749.966 317.778 752.86 309.914 754.513 302.74C754.805 301.657 755.08 300.614 755.34 299.613V371.445Z"
          fill="white"
        />
        <path
          d="M847.783 165.332L893.672 165.332V227.001C895.326 220.654 897.806 213.756 901.113 206.306C904.696 198.856 909.382 191.682 915.169 184.784C921.233 177.61 928.536 171.816 937.08 167.401C945.9 162.986 956.235 160.779 968.086 160.779V204.651C953.203 204.651 940.388 207.824 929.639 214.17C919.166 220.516 910.76 228.242 904.42 237.348C899.823 243.952 896.24 250.412 893.672 256.726V371.447H847.783V165.332Z"
          fill="white"
        />
        <path
          d="M1052.42 122.286V78L997.435 78V122.286L1052.42 122.286Z"
          fill="white"
        />
        <path
          d="M1047.87 165.33H1001.57V371.446H1047.87V165.33Z"
          fill="white"
        />
        <path
          d="M1089.61 303.57L1132.19 303.57C1134.4 314.055 1140.05 322.609 1149.14 329.231C1158.24 335.577 1170.5 338.75 1185.93 338.75C1195.86 338.75 1203.57 337.646 1209.09 335.439C1214.87 333.232 1218.87 330.196 1221.07 326.334C1223.55 322.471 1224.8 318.056 1224.8 313.089C1224.8 307.019 1223 302.328 1219.42 299.017C1216.11 295.706 1211.15 292.947 1204.54 290.739C1197.92 288.532 1189.65 286.6 1179.73 284.945C1169.54 282.462 1159.48 279.702 1149.55 276.667C1139.63 273.632 1130.67 269.907 1122.68 265.492C1114.69 260.801 1108.35 255.007 1103.66 248.109C1099.25 240.935 1097.05 232.243 1097.05 222.034C1097.05 212.653 1099.12 204.237 1103.25 196.787C1107.66 189.061 1113.72 182.577 1121.44 177.334C1129.16 172.092 1138.25 168.091 1148.73 165.332C1159.2 162.296 1170.64 160.779 1183.04 160.779C1200.95 160.779 1215.84 163.676 1227.69 169.47C1239.82 175.265 1248.91 183.405 1254.97 193.89C1261.31 204.375 1264.48 216.378 1264.48 229.898L1223.97 229.898C1221.76 218.861 1217.49 210.859 1211.15 205.892C1204.81 200.926 1195.3 198.442 1182.63 198.442C1169.95 198.442 1160.3 200.65 1153.69 205.065C1147.07 209.479 1143.77 215.55 1143.77 223.276C1143.77 229.07 1145.83 233.761 1149.97 237.348C1154.38 240.659 1160.58 243.556 1168.57 246.039C1176.56 248.523 1185.93 251.006 1196.68 253.489C1206.6 256.249 1215.98 259.146 1224.8 262.181C1233.61 264.94 1241.47 268.527 1248.36 272.942C1255.53 277.081 1261.18 282.599 1265.31 289.498C1269.44 296.396 1271.51 304.949 1271.51 315.159C1271.51 327.851 1268.07 338.75 1261.18 347.856C1254.56 356.961 1244.91 363.997 1232.24 368.964C1219.56 373.655 1204.26 376 1186.35 376C1170.64 376 1157 374.206 1145.42 370.619C1134.12 367.032 1124.61 362.342 1116.89 356.547C1109.45 350.753 1103.66 344.545 1099.53 337.922C1095.4 331.3 1092.5 324.954 1090.85 318.884C1089.47 312.813 1089.06 307.709 1089.61 303.57Z"
          fill="white"
        />
        <path
          d="M1294.48 165.33L1344.09 165.33V109.869L1390.39 109.869V165.33H1440V202.994H1390.39L1390.39 371.446H1344.09V202.994L1294.48 202.994V165.33Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_8002_19825">
          <rect
            width="1440"
            height="24"
            fill="white"
            transform="translate(0 300)"
          />
        </clipPath>
        <clipPath id="clip1_8002_19825">
          <rect
            width="1440"
            height="24"
            fill="white"
            transform="translate(0 326)"
          />
        </clipPath>
        <clipPath id="clip2_8002_19825">
          <rect
            width="1440"
            height="24"
            fill="white"
            transform="translate(0 352)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}