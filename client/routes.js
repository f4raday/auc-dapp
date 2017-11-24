Router.configure({
    notFoundTemplate: 'notFound',
});

Router.route('/', {
    template: 'home',
    name: 'home'
});

// Route for view1
Router.route('/current', {
    template: 'currentLots',
    name: 'currentlots'
});

// Route for view2
Router.route('/create', {
    template: 'createLot',
    name: 'lot'
});

