<script>
    let hide = true;
    export let isfirst = false;

    import { ref, remove } from 'firebase/database';
    import { db } from '$lib/firebase';

    import { stoptimer, isnotprocessing } from './stores/app';

    export let locatedat = '';
    async function deletedata(){
        await remove(ref(db, `will/${locatedat}`));
        if (isfirst){
            stoptimer.set(true);
            isnotprocessing.set(true);
        }
    }
</script>

<button on:click={deletedata}>❌</button>

<style>
    button {
        width: 40px;
        height: 40px;
        border-radius: 200px;
        font-size: 20px;
        padding: 0;
        box-sizing: border-box;
    }
</style>