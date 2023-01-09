interface Attributes {
    scriptid: string;
}
interface TextField {
    _text: string;
}
interface Customrecordcustomfield {
    _attributes: Attributes;
    fieldtype: TextField;
    label: TextField;
}
interface Customrecordcustomfields {
    customrecordcustomfield: Customrecordcustomfield[];
}
interface Customrecordtype {
    _attributes: Attributes;
    fieldtype: TextField;
    label: TextField;
    customrecordcustomfields: Customrecordcustomfields;
}
export interface IXmlField {
    [key: string]: Customrecordtype;
}