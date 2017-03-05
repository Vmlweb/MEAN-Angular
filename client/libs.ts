//Modules
import 'jquery'

//Interface Styles
import 'semantic-ui-less/semantic.less'

//Interface Modules
const importAll = r => { r.keys().forEach(r) }
importAll((require as any).context('semantic-ui-less/definitions/', true, /\.js$/))