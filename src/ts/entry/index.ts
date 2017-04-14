import TWEEN = require('tween.js');
class NumberPicker{
    constructor(args?:{length?:number}){
        args = args || {};
        this._length = args.length || 1;
        window.requestAnimationFrame(animate);
        function animate(time:number){
            window.requestAnimationFrame(animate);
            TWEEN.update(time);
        }
        for(let i = 0, l = this._length; i < l; i++){
            this._outArray[i] = '0';
        }
        this._outString = this._outArray.join('');
    }
    private _length: number;
    private _wrapper: HTMLElement;
    private $pickers: HTMLElement[] = [];
    private _indicator: number[] = [];
    private _sx: number;
    private _touchIndex: number;
    private _sizeRatio: number = 30;
    private _numberHeight: number = 180;
    private _fontSize: number = 5;
    private _outString:string;
    private _outArray:string[] = [];
    public insert(dom:HTMLElement){
        this._wrapper = document.createElement('div');
        this._wrapper.classList.add('number-picker');
        this._wrapper.style.display = 'inline-block';
        this._wrapper.style.backgroundColor = '#fff';
        //this._wrapper.style.borderRadius = 0.5*this._sizeRatio + 'px';
        // this._wrapper.style.boxShadow = 'inset 0 '+5*this._sizeRatio+'px '+5*this._sizeRatio+'px '+(-5*this._sizeRatio)+'px #000,' +
        //     'inset 0 '+(-5*this._sizeRatio)+'px '+5*this._sizeRatio+'px '+(-5*this._sizeRatio)+'px #000,' +
        //     '0 0 '+this._sizeRatio+'px 0 #000';
        this._wrapper.style.height = '18rem';
        this._wrapper.style.overflow = 'hidden';
        for(let i=0,l=this._length; i<l; i++){
            this.genPicker(i);
        }
        for(let i=0,l=this._length; i<l; i++){
            this._wrapper.appendChild(this.$pickers[i]);
            // if(i !== l -1){
            //     this.$pickers[i].style.borderRight = '1px solid #000';
            // }
        }
        dom.appendChild(this._wrapper);
    }
    private movePicker(i:number, from:number, to:number, duration?:number, timingFunction?:any){
        let h = 180;
        let t = to%(10*h);
        let p = this.$pickers[i];
        duration = duration || 0;
        timingFunction = timingFunction || TWEEN.Easing.Linear.None;
        let tween = new TWEEN.Tween({y: -9*h+from})
            .to({y: -9*h+t}, duration)
            .onUpdate(function() {
                p.style.transform = 'translate3d(0,'+this.y+'px,0)';
            });
        tween.easing(timingFunction);
        tween.start();
    }
    private genPicker(index:number){
        let $picker = document.createElement('div');
        $picker.classList.add('picker');
        $picker.style.cssFloat = 'left';
        $picker.style.fontSize = '0';
        $picker.style.width = '5rem';
        $picker.style.position = 'relative';
        for(let i=0; i<30; i++){
            let $number = document.createElement('div');
            $number.innerText = i%10 + '';
            $number.style.fontSize = this._fontSize*this._sizeRatio + 'px';
            $number.style.lineHeight = '1';
            $number.style.padding = '0.5rem 1rem';
            $picker.appendChild($number);
        }
        $picker.addEventListener('touchstart', this.touchstart.bind(this, index));
        $picker.addEventListener('touchmove', this.touchmove.bind(this));
        $picker.addEventListener('touchend', this.touchend.bind(this));
        this.$pickers[index] = $picker;
        this.movePicker(index, 0, 0);
        this._indicator[index] = 0;
    }
    private touchstart(index:number, event:TouchEvent){
        this._sx = event.touches[0].clientY;
        this._touchIndex = index;
    }
    private touchmove(event:TouchEvent){
        let d = event.touches[0].clientY - this._sx;
        let from = this._indicator[this._touchIndex];
        let to = this._indicator[this._touchIndex] + d;
        this.movePicker(this._touchIndex, from, to);
        this._sx = this._sx + d;
        this._indicator[this._touchIndex] = to%(10*this._numberHeight);
    }
    private touchend(){
        this.numberSelect();
    }
    private numberSelect(){
        let t = this._indicator[this._touchIndex];
        let to = t - t%this._numberHeight;
        this.movePicker(this._touchIndex, t, to, 300, TWEEN.Easing.Cubic.Out);
        this._indicator[this._touchIndex] = to%(10*this._numberHeight);
        let num = +(this._indicator[this._touchIndex] / this._numberHeight).toString().split('.')[0];
        if(num === 0){
            num = 0;
        }else if(num < 0){
            num = -(num);
        }else{
            num = 10 -num;
        }
        this._outArray[this._touchIndex] = num + '';
        this._outString = this._outArray.join('');
        if(this.onChange){
            this.onChange({
                changeNumber: num,
                changeIndex: this._touchIndex,
                outString: this._outString,
                outArray: this._outArray
            });
        }
    }
    public onChange:(res:any)=>void;
    public addEventListen(event:string, callback:(res:any)=>void){
        if(event === 'change'){
            this.onChange = callback;
        }
    }
}
export = NumberPicker;