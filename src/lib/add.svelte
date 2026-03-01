<script>
    import { isnotAdding } from "./stores/app";

    import { ref, set, get, push } from 'firebase/database';
    import { db } from '$lib/firebase';

    let titledata = '';
    let estimateddata = [0,0,0];

    async function savedata(){
        if (titledata){
            await push(ref(db, `will`), {
                title: titledata,
                estimated: estimateddata[0]*3600 + estimateddata[1]*60 + estimateddata[2],
                modifiedformer: 0
            });
        } else {
            await push(ref(db, `will`), {
                title: '기다리기',
                estimated: estimateddata[0]*3600 + estimateddata[1]*60 + estimateddata[2],
                modifiedformer: 0
            });
        }
        titledata = '';
        estimateddata = [0,3,0];
    }
    function moretime(t){ estimateddata[2] += t; }
    function moretimeM(t){ estimateddata[1] += t; }
    function setzero(){ estimateddata[0] = 0; estimateddata[1] = 0; estimateddata[2] = 0; }
</script>

<button id="popupbttn" on:click={() => {isnotAdding.update($isnotAdding => !$isnotAdding)}} disabled={!$isnotAdding}>➕</button>

<div id="popupcontainer" class:invs={$isnotAdding}>
    <div id="titleinput">
        <input type="text" id="title" placeholder="제목" bind:value={titledata} required>
    </div>
    <div id="estimatedinput">
        <input type="number" id="estimated" placeholder="시간" bind:value={estimateddata[0]}>
        <input type="number" id="estimated" placeholder="분" bind:value={estimateddata[1]}>
        <input type="number" id="estimated" placeholder="초" bind:value={estimateddata[2]}>
    </div>
        <div id="plusbttn">
            <button class="smalltxt" on:click={()=>{moretime(10)}}>+10s</button>
            <button class="smalltxt" on:click={()=>{moretimeM(1)}}>+1min</button>
            <button class="smalltxt" on:click={setzero}>reset</button>
        </div>
        <button id="savebttn" on:click={savedata}>✅</button>
    <button id="closebttn" on:click={() => {isnotAdding.update($isnotAdding => !$isnotAdding)}}>❌</button>
</div>

<style>
    @media (orientation: landscape) { #popupcontainer { top: 30px; right: 30px; bottom: 30px; left: 70dvw; } #title { width: calc(30dvw - 130px); } }
    @media (orientation: portrait) { #popupcontainer { top: 70dvh; right: 30px; bottom: 30px; left: 30px; } #title { width: calc(100dvw - 160px); } }
    #popupcontainer { position: fixed; background-color: rgba(204, 255, 255, 0.8); padding: 20px; }
    #popupbttn { position: fixed; bottom: 40px; right: 40px; }
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