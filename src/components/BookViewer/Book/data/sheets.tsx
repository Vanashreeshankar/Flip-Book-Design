import WebLeft from "../Content/web/Left";
import WebRight from "../Content/web/Right";
import FullStackLeft from "../Content/FullStack/Left";
import FullStackRight from "../Content/FullStack/Right";
import UiLeft from "../Content/UIdesign/Left";
import UiRight from "../Content/UIdesign/Right";
import Right from "../Content/3Ddesign/Right";
import Left from "../Content/3Ddesign/Left";
import IntroRight from "../Content/Intro/Right";

export const sheets = [
    {
        id: 1,
        front: <IntroRight />,
        back: <WebLeft />,
    },
    {
        id: 2,
        front: <WebRight />,
        back: <FullStackLeft />,
    },
    {
        id: 3,
        front: <FullStackRight />,
        back: <UiLeft />,
    },
    {
        id: 4,
        front: <UiRight />,
        back: <Left />,
    },
    {
        id: 5,
        front: <Right />,
       
    },
];