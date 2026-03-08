<script>
    import Queuetask from "./queuetask.svelte";
    import { isnotprocessing } from "./stores/app";
</script>

<div id="container" class:dis100={$isnotprocessing}>
    <Queuetask />
</div>

<style>
    @media (orientation: landscape) {
        #container {
            top: 20px;
            left: 40dvw;
            right: 20px;
            bottom: 20px;
        }
        .dis100 { left: 20px !important; }
    }
    @media (orientation: portrait) {
        #container {
            top: 40dvh;
            left: 20px;
            right: 20px;
            bottom: 20px;
        }
        .dis100 { top: 20px !important; }
    }
    #container {
        position: fixed;
        background-color: #1428A0;
        box-sizing: border-box;
        border-radius: 20px;
        background: #ffffff;
        box-shadow: inset 20px 20px 60px #1428A0,
        inset -20px -20px 60px #ffffff;
    }
</style>