declare class NumberPicker {
    constructor(args?: {
        length?: number;
    });
    private _length;
    private _wrapper;
    private $pickers;
    private _indicator;
    private _sx;
    private _touchIndex;
    private _sizeRatio;
    private _numberHeight;
    private _fontSize;
    private _outString;
    private _outArray;
    insert(dom: HTMLElement): void;
    private movePicker(i, from, to, duration?, timingFunction?);
    private genPicker(index);
    private touchstart(index, event);
    private touchmove(event);
    private touchend();
    private numberSelect();
    onChange: (res: any) => void;
    addEventListen(event: string, callback: (res: any) => void): void;
}
export = NumberPicker;
