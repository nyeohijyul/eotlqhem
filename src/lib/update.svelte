<script>
    let hide = true;

    import { ref, set, get, push } from 'firebase/database';
    import { db } from '$lib/firebase';
    import { nowdate, inprogress, expectedtime, uid } from './stores/app';

    export let estimateddata = 0;

    export let locatedat = '';
    export let locatedattitle = '';

    export let imodifiedformerofthisone = 0;

    let estimatedhours = Math.floor(estimateddata/3600);
    let estimatedminutes = Math.floor( ( estimateddata - estimatedhours*3600 ) / 60);
    let estimatedseconds = estimateddata - estimatedhours*3600 - estimatedminutes*60;

    async function savedata(){
        await set(ref(db, `${$uid}/will/${locatedat}`), {
            title: locatedattitle,
            estimated: estimatedhours*3600 + estimatedminutes*60 + estimatedseconds,
            modifiedformer: imodifiedformerofthisone
        });
        inprogress.set([$inprogress[0],estimatedhours*3600 + estimatedminutes*60 + estimatedseconds,$inprogress[2]]);
        $nowdate.setSeconds($nowdate.getSeconds() + $inprogress[1]);
        let mm = $nowdate.getMonth() + 1;
        let dd = $nowdate.getDate();
        let hours = $nowdate.getHours();
        let minutes = $nowdate.getMinutes();
        let secs = $nowdate.getSeconds();
        let timeinfo = mm+'월 '+dd+'일 '+hours+'시 '+minutes+'분 '+secs+'초'
        expectedtime.set(timeinfo)
        hide = !hide
    }
    function moretime(t){ estimatedseconds += t }
    function moretimeM(t){ estimatedminutes += t }
    function setzero(){ estimatedhours = 0; estimatedminutes = 0; estimatedseconds = 0 }
</script>

<button id="popupbttn" on:click={() => {hide = !hide}} disabled={!hide}>✏️</button>

<div id="popupcontainer" class:invs={hide}>
    <div id="contents">
        <p id="title">{locatedattitle}</p>
        <div id="estimatedinput">
            <input type="number" id="estimated" placeholder="시간" bind:value={estimatedhours}>
            <input type="number" id="estimated" placeholder="분" bind:value={estimatedminutes}>
            <input type="number" id="estimated" placeholder="초" bind:value={estimatedseconds}>
        </div>
        <div id="plusbttn">
            <button class="smalltxt" on:click={()=>{moretime(10)}}>+10s</button>
            <button class="smalltxt" on:click={()=>{moretimeM(1)}}>+1min</button>
            <button class="smalltxt" on:click={setzero}>reset</button>
        </div>
    </div>
    <button id="savebttn" on:click={savedata}>✅</button>
    <button id="closebttn" on:click={() => {hide = !hide}}>❌</button>
</div>

<style>
    @media (orientation: landscape) { #popupcontainer { top: 30px; right: 30dvw; bottom: 30px; left: calc(40dvw + 15px); } #title { width: calc(30dvw - 115px); } }
    @media (orientation: portrait) { #popupcontainer { top: calc(40dvh + 15px); right: 30px; bottom: 30dvh; left: 30px; } #title { width: calc(100dvw - 160px); } }
    #popupcontainer { position: fixed; background-color: rgba(204, 204, 204, 0.8); padding: 20px; }
    #closebttn { position: absolute; top: 20px; right: 20px; }
    #savebttn { position: absolute; top: 80px; right: 20px; }
    .invs { display: none !important; }
    .smalltxt { font-size: 10px; }
    button {
        width: 40px;
        height: 40px;
        border-radius: 200px;
        font-size: 20px;
        padding: 0;
        box-sizing: border-box;
    }
    input { width: 30px; margin-bottom: 10px; }
    p { margin-top: 0; }
    #contents { overflow: auto; }
</style>