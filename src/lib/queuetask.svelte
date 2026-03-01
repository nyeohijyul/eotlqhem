<script>
    import { isnotprocessing, inprogress, second, stoptimer, expectedtime, nowdate, uid } from "./stores/app";

    import { onMount } from 'svelte';
    import { ref, onValue, get, push, remove, set } from 'firebase/database';
    import { db } from '$lib/firebase';
    import Update from "./update.svelte";
    import Up from "./up.svelte";
    import Down from "./down.svelte";
    import Delete from "./delete.svelte";

    let queues = [];
    let starttime;

    let now = new Date();

    onMount(() => {
        onValue(ref(db, `${$uid}will`), (s) => {
            queues = [];
            if(s.val()){
                let a = Object.keys( s.val() );
                if(a.length){
                    let sum = 0;
                    let originalnow = new Date(now);
                    nowdate.set(originalnow);
                    for (let i = 0; i < a.length; i++) {
                        now = new Date(originalnow);
                        sum += Number(s.val()[a[i]].estimated);
                        now.setSeconds(now.getSeconds() + sum);
                        let mm = now.getMonth() + 1;
                        let dd = now.getDate();
                        let hours = now.getHours();
                        let minutes = now.getMinutes();
                        let secs = now.getSeconds();

                        let timeinfo = mm+'월 '+dd+'일 '+hours+'시 '+minutes+'분 '+secs+'초';
                        if (i == 0) {
                            queues.push([s.val()[a[i]].title, s.val()[a[i]].estimated, a[i], timeinfo, true, s.val()[a[i]].modifiedformer]);
                            expectedtime.set(timeinfo);
                        } else {
                            queues.push([s.val()[a[i]].title, s.val()[a[i]].estimated, a[i], timeinfo, false, s.val()[a[i]].modifiedformer]);
                        }
                    }
                    now = new Date(originalnow);
                }
            }
        });
    });

    async function start([titlename, estimatedtime, key, time, valid, modified]){
        if($isnotprocessing && valid){
            now = new Date();
            stoptimer.set(false);
            inprogress.update($inprogress => [titlename, estimatedtime, key]);
            starttime = Date.now();

            await set(ref(db, `${$uid}/done/${key}`), {
                title: titlename,
                estimated: estimatedtime
            });

            let haveyoubeencanceled = await get(ref(db, `${$uid}/will/${$inprogress[2]}/havebeencanceled`));

            if (haveyoubeencanceled) {
                await set(ref(db, `${$uid}/will/${$inprogress[2]}/havebeencanceled`), (await get(ref(db, `${$uid}/will/${$inprogress[2]}/havebeencanceled`))).val() + 1);
            } else {
                await set(ref(db, `${$uid}/will/${$inprogress[2]}/havebeencanceled`), 0);
            }
            isnotprocessing.update($isnotprocessing => !$isnotprocessing);
        }
        timer();
    }

    function timer() {
        let time = setInterval(() => {
            let currenttime = Date.now();
            let elapsedMs = currenttime - starttime;
            let seconds = Math.floor(elapsedMs/1000);

            second.set( stringifytimenum(seconds, '') );
            if($stoptimer) { clearInterval(time); second.set(''); }
        }, 1000)
    }

    function stringifytimenum(str, phrase=" 동안") {
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
        result += sec + "초" + phrase;
        return result;
    }
</script>

<div id="container" class:dis100={$isnotprocessing}>
    {#each queues as a, i}
        <div class="blocks">
            <div
                on:click={()=>{ start(a) }}
                role="button" tabindex="0" on:keydown={(e)=>{if(e.key === "Enter"){}}}>{a[0]}</div>
            <div>{stringifytimenum(a[1])}</div>
            <div class:invs={$isnotprocessing}>예상 완료 시각 : {a[3]}</div>
            <Update locatedat={a[2]} locatedattitle={a[0]} estimateddata={a[1]} imodifiedformerofthisone={a[5]} />
            <Up locatedat={a[2]} tmpmodifiedformer={a[5]} isfirst={a[4]}/>
            <Down locatedat={a[2]} />
            <Delete locatedat={a[2]} isfirst={a[4]} />
        </div>
    {/each}
    {#if !queues.length}
        데이터가 없습니다.
    {/if}
</div>

<style>
    @media(orientation: landscape){ #container{ height: calc(100dvh - 60px); margin: 10px 10px 10px 15px; } }
    @media(orientation: portrait){ #container{ height: calc(60dvh - 45px); margin: 15px 10px 10px; } }
    #container {
        background-color: white;

        overflow: auto;
        padding: 20px;
        box-sizing: border-box;
    }
    .dis100 { height: calc(100dvh - 60px) !important; margin: 10px !important; }
    .invs { display: none; }
    .blocks { margin-bottom: 20px; }
</style>