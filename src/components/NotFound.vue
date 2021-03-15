<template>
    <div class="body">
        <div id="message" class="no-padding">
            <h2>404</h2>
            <h1>Page non trouvée</h1>
            <p>Le fichier spécifié n'a pas été trouvé, verifiez les erreurs dans l'url et réessayez.</p>
        </div>
    </div>
</template>

<style scoped>
    .body { background: #ECEFF1; color: rgba(0,0,0,0.87); font-family: Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; height: 100vh; width: 100vw; position: absolute; top: 0; }
    #message { background: white; max-width: 360px; margin: 100px auto 16px; padding: 32px 24px 16px; border-radius: 3px; }
    #message h3 { color: #888; font-weight: normal; font-size: 16px; margin: 16px 0 12px; }
    #message h2 { color: #17969C; font-weight: bold; font-size: 16px; margin: 0 0 8px; }
    #message h1 { font-size: 22px; font-weight: 300; color: rgba(0,0,0,0.6); margin: 0 0 16px;}
    #message p { line-height: 140%; margin: 16px 0 24px; font-size: 14px; }
    #message a { display: block; text-align: center; background: #039be5; text-transform: uppercase; text-decoration: none; color: white; padding: 16px; border-radius: 4px; }
    #message, #message a { box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24); }
    #load { color: rgba(0,0,0,0.4); text-align: center; font-size: 13px; }
    @media (max-width: 600px) {
        .body, #message { margin-top: 0; background: white; box-shadow: none; }
        .body { border-top: 16px solid #17969C; }
    }
</style>

<script>
export default {
    
}
</script>