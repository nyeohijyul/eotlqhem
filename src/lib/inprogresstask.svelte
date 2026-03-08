<script>
    import { db } from "./firebase";

    import { isnotprocessing, inprogress, second, stoptimer, expectedtime, uid } from "./stores/app";

    import { set, ref, remove, get } from 'firebase/database';

    async function imstucked(){
        isnotprocessing.update($isnotprocessing => !$isnotprocessing);
        stoptimer.set(true);
        await remove(ref(db, `${$uid}/will/${$inprogress[2]}`));
        await set(ref(db, `${$uid}/done/${$inprogress[2]}/note`), "failed");
    }
    async function imdone(){
        isnotprocessing.update($isnotprocessing => !$isnotprocessing);
        stoptimer.set(true);
        await remove(ref(db, `${$uid}/will/${$inprogress[2]}`));
        await set(ref(db, `${$uid}/done/${$inprogress[2]}/note`), "success");
    }
    async function moretime(a){
        await set(ref(db, `${$uid}/done/${$inprogress[2]}/estimated`), Number($inprogress[1]) + a);
        await set(ref(db, `${$uid}/will/${$inprogress[2]}/estimated`), Number($inprogress[1]) + a);
        inprogress.set([$inprogress[0],Number($inprogress[1]) + a, $inprogress[2]]);
    }

    function stringifytimenum(str) {
        let sec = Number(str);
        let result = '';
        if (sec / 3600 > 0) {
            result += parseInt(sec/3600) + '시간 ';
            sec -= parseInt(sec/3600)*3600;
        }
        if (sec / 60 > 0) {
            result += parseInt(sec/60) + '분 ';
            sec -= parseInt(sec/60)*60;
        }
        result += sec + "초 동안";
        return result;
    }
    async function cancel(){
        await remove(ref(db, `${$uid}/done/${$inprogress[2]}`));
        let haveyoubeencanceled = await get(ref(db, `${$uid}/will/${$inprogress[2]}/havebeencanceled`));
        if (haveyoubeencanceled) {
            await set(ref(db, `${$uid}/will/${$inprogress[2]}/havebeencanceled`), (await get(ref(db, `${$uid}/will/${$inprogress[2]}/havebeencanceled`))).val() + 1);
        } else {
            await set(ref(db, `${$uid}/will/${$inprogress[2]}/havebeencanceled`), 0);
        }
        stoptimer.set(true);
        isnotprocessing.update($isnotprocessing => !$isnotprocessing);
    }
</script>

<div id="container">
    <div id="secondcontainer">
        <p id="title">현재 : {$inprogress[0]}</p>
        <p id="processedtime">현재 진행 : {$second}</p>
        <p id="estimatedtime">예상 작업 시간 : {stringifytimenum($inprogress[1])}</p>
        <p id="estimatedendlinetime">예상 완료 시각 : {$expectedtime}</p>
        <button id="success" on:click={cancel}>취소</button>
        <button id="fail" on:click={imstucked}>포기</button>
        <button id="moretime30" on:click={() => {moretime(30)}}>+30초</button>
        <button id="moretime5min" on:click={() => {moretime(300)}}>+5분</button>
        <button id="success" on:click={imdone}>성공</button>
    </div>
</div>
<br>


<style>
    @media (orientation: landscape) {
        #container {
            top: 10px;
            left: 10px;
            right: 60dvw;
            bottom: 10px;
        }
        #secondcontainer { height: calc(100dvh - 40px); margin: 10px 20px 10px 10px; }
    }
    @media (orientation: portrait) {
        #container {
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 60dvh;
        }
        #secondcontainer { height: calc(40dvh - 40px); margin: 10px 10px 10px; }
    }
    #container {
        position: fixed;
        background-color: #1428A0;
        box-sizing: border-box;
    }
    #secondcontainer {
        background-color: white;

        overflow: auto;
        box-sizing: border-box;
        padding: 20px;
        border-radius: 20px;
background: #ffffff;
box-shadow: inset 20px 20px 60px #1428A0,
            inset -20px -20px 60px #ffffff;
    }
    p { margin-top: 0; }
</style>