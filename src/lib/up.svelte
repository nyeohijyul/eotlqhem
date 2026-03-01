<script>
    let hide = true;

    import { ref, set, get, push } from 'firebase/database';
    import { db } from '$lib/firebase';

    import { isnotprocessing, uid } from './stores/app';

    let estimateddata = 0;
    export let tmpmodifiedformer = 0;

    export let locatedat = '';
    export let isfirst = false;
    let titledata = '';

    let estimatedhours = Math.floor(estimateddata/3600);
    let estimatedminutes = Math.floor( ( estimateddata - estimatedhours*3600 ) / 60);
    let estimatedseconds = estimateddata - estimatedhours*3600 - estimatedminutes*60;

    async function savedata(){
        await set(ref(db, `${$uid}/will/${locatedat}/modifiedformer`), Number(tmpmodifiedformer)+1);
        let modifiedlocatedat;

        let tmp = locatedat.split('');
        tmp.pop();
        tmp.pop();
        
        modifiedlocatedat = tmp.join('') + '--'+ tmpmodifiedformer + tmpmodifiedformer + tmpmodifiedformer;

        if (titledata){
            await set(ref(db, `${$uid}/will/${modifiedlocatedat}`), {
                title: titledata,
                estimated: estimatedhours*3600 + estimatedminutes*60 + estimatedseconds,
                modifiedformer: 0
            });
        } else {
            await set(ref(db, `${$uid}/will/${modifiedlocatedat}`), {
                title: '기다리기',
                estimated: estimatedhours*3600 + estimatedminutes*60 + estimatedseconds,
                modifiedformer: 0
            });
        }
    
    titledata=''
    estimateddata = 0
    hide = !hide
    }
    function moretime(t){ estimatedseconds += t }
    function moretimeM(t){ estimatedminutes += t }
    function setzero(){ estimatedhours = 0; estimatedminutes = 0; estimatedseconds = 0 }
</script>

<button id="popupbttn" on:click={() => {hide = !hide}} disabled={(!hide || tmpmodifiedformer>8)||(isfirst && !$isnotprocessing)}>🔼</button>

<div id="popupcontainer" class:invs={hide}>
    <div id="titleinput">
        <input type="text" id="title" placeholder="제목" bind:value={titledata}>
    </div>
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
    <button id="closebttn" on:click={() => {hide = !hide}}>❌</button>
    <button id="savebttn" on:click={savedata}>✅</button>
</div>

<style>
    @media (orientation: landscape) { #popupcontainer { top: 30px; right: calc(60dvw + 15px); bottom: 30px; left: 30px; } #title { width: calc(40dvw - 145px); } }
    @media (orientation: portrait) { #popupcontainer { top: 30px; right: 30px; bottom: calc(60dvh + 15px); left: 30px; } #title { width: calc(100dvw - 160px); } }
    #popupcontainer { position: fixed; background-color: rgba(255, 255, 204, 0.8); padding: 20px; }
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
</style>