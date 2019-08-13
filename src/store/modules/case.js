import { queryCaseNo } from '@/api/case';

const caseModules = {
    state: {
        caseRandom:"",//生成案件随机数，后端还没有生成案号和流水号的时候用来判断案件的唯一性
    },
    mutations:{
        getCaseRandom(state){//获取随机数
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
            var uuid = s.join("");
            state.caseRandom=uuid
        }
    },
    actions: {
        searchCaseNo ({ commit }, caseNo) {
            return new Promise((resolve, reject) => {
                queryCaseNo(caseNo)
                    .then(response => {
                        console.log(response);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        }
    }
};

export default caseModules;
