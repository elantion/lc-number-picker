import '../../sass/entry/test.scss';
import NumberPicker = require('./index');
let numberPicker = new NumberPicker({length: 6});
numberPicker.addEventListen('change', function (res) {
    console.log(res);
});
numberPicker.insert(document.getElementById('number-picker'));