<script>
    import {createEventDispatcher} from 'svelte'

    const dispatch = createEventDispatcher();
</script>

<button id="logoutbttn" on:click={()=>dispatch("logout")}>❌</button>

<style>
    #logoutbttn { position: fixed; top: 40px; right: 40px; }
    button {
        width: 40px;
        height: 40px;
        border-radius: 200px;
        font-size: 20px;
        padding: 0;
        box-sizing: border-box;
    }
</style>