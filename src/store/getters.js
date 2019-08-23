const getters = {
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    access: state => state.user.access,
    new: state => state.message.new,
    read: state => state.message.read,
    caseNo: state => state.search.caseNo,
    idDraw: state => state.app.idDraw,
    isdq: state => state.user.isdq,
    caseId: state => state.app.caseId,
    breifName: state => state.app.breifName,
    litigantType: state => state.app.litigantType,
    agentType: state => state.app.agentType,
    tabList:state => state.app.tabList,
    hastabList: (state, getters) => (title) => {
        console.log("8889999999999",state.app.tabList)
        var tabObj=state.app.tabList.find(tabList => tabList.title === title)
        // console.log("测试测试测",typeof(tabObj))
        //判断是否有该选项卡权限
        if(tabObj){
           return true
        }else{
           return false
        }
    },
    caseRandom: state => state.caseModules.caseRandom,
    roLeName: state => state.app.roLeName,
    userIdCard: state => state.app.userIdCard,
    userName: state => state.app.userName,
    userId: state => state.app.userId,
    isCl: state => state.app.isCl,
    batchCache: state => state.batch.batchCache
};
export default getters;
