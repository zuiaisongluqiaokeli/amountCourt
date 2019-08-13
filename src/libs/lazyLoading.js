export default (url) =>()=>import(`@/views/${url}.vue`)
// module.exports = file => require(`@/views/${file}`).default // vue-loader at least v13.0.0+
// export default (url) =>()=>import(`@views/${url}`)
// export default (url) =>()=>import(`@/`+`\${url}.vue`)