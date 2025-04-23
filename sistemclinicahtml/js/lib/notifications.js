export async function setupBrowserNotifications() {
    if (!('Notification' in window)) {
        console.log('Este navegador não suporta notificações desktop');
        return;
    }
    
    if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;
    }
    
    // Notificações serão implementadas aqui
    console.log('Notificações configuradas com sucesso!');
}