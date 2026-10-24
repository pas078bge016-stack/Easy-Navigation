// Fixed AR Campus Navigator with Geodetic Measurement Tools and User Authentication

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const BUILDING_FETCH_RADIUS = 350; // meters
const VISIBILITY_ANGLE = 20; // degrees: tolerance for AR label visibility
const BUILDING_DOT_SIZE = 12; // pixels
const ARRIVAL_DISTANCE = 15; // meters - distance threshold for arrival notification

// UI Elements
const startBtn = document.getElementById('startBtn');
const splash = document.getElementById('splash');
const appDiv = document.getElementById('app');
const mapBtn = document.getElementById('mapBtn');
const arBtn = document.getElementById('arBtn');
const modelBtn = document.getElementById('modelBtn');
const measureBtn = document.getElementById('measureBtn');
const osmBtn = document.getElementById('osmBtn');
const buildingSelect = document.getElementById('buildingSelect');
const refreshBldsBtn = document.getElementById('refreshBlds');
const useFixedBtn = document.getElementById('useFixed');
const useOSMBtn = document.getElementById('useOSM');
const camVideo = document.getElementById('cam');
const cameraView = document.getElementById('cameraView');
const osmBuildingsView = document.getElementById('osmBuildingsView');
const arCanvas = document.getElementById('arCanvas');
const ctx = arCanvas.getContext('2d');
const infoBox = document.getElementById('infoBox');
const miniMapDiv = document.getElementById('miniMap');
const directionIndicator = document.getElementById('directionIndicator');
const navText = document.getElementById('navText');
const distanceProgress = document.querySelector('.distance-progress');
const measureControls = document.getElementById('measureControls');
const osmControls = document.getElementById('osmControls');
const modelViewer = document.getElementById('modelViewer');
const closeModelViewer = document.getElementById('closeModelViewer');
const routeStatus = document.getElementById('routeStatus');
const routeCacheIndicator = document.getElementById('routeCacheIndicator');
const routeDetails = document.getElementById('routeDetails');
const routeSummaryTitle = document.getElementById('routeSummaryTitle');
const routeSummaryMetrics = document.getElementById('routeSummaryMetrics');
const worldRouteQuery = document.getElementById('worldRouteQuery');
const worldRouteSearchBtn = document.getElementById('worldRouteSearchBtn');
const worldRouteResults = document.getElementById('worldRouteResults');
const routeSteps = document.getElementById('routeSteps');
const enhancedCompass = document.getElementById('enhancedCompass');
const enhancedCompassNeedle = document.getElementById('enhancedCompassNeedle');
const enhancedCompassDegree = document.getElementById('enhancedCompassDegree');
const oldCompass = document.getElementById('oldCompass');
const deviceCompass = document.getElementById('deviceCompass');
const deviceCompassDial = document.getElementById('deviceCompassDial');
const deviceCompassDegree = document.getElementById('deviceCompassDegree');
const deviceCompassStatus = document.getElementById('deviceCompassStatus');
const locationStatusText = document.getElementById('locationStatusText');

// NEW: Location request button
const locationRequestBtn = document.getElementById('locationRequestBtn');

// NEW: Permission request elements
const permissionRequest = document.getElementById('permissionRequest');
const grantPermissionsBtn = document.getElementById('grantPermissions');
const skipPermissionsBtn = document.getElementById('skipPermissions');

// NEW: Camera permission request elements
const cameraPermissionRequest = document.getElementById('cameraPermissionRequest');
const grantCameraPermissionBtn = document.getElementById('grantCameraPermission');
const skipCameraPermissionBtn = document.getElementById('skipCameraPermission');

// NEW: Route type selection elements
const routeTypeButtons = document.querySelectorAll('.route-type-btn');

// OSM Search elements
const osmSearchInput = document.getElementById('osmSearchInput');
const osmSearchButton = document.getElementById('osmSearchButton');
const osmSearchResults = document.getElementById('osmSearchResults');

// Map type controls
const mapTypeControls = document.getElementById('mapTypeControls');
const mapTypeButtons = document.querySelectorAll('.map-type-btn');
const mapTypeToggle = document.getElementById('mapTypeToggle');
const mapTypeWrapper = document.getElementById('mapTypeWrapper');
mapTypeToggle.addEventListener('click', function() {
    const isOpen = mapTypeWrapper.classList.toggle('active');
    mapTypeToggle.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', function(event) {
    if (!mapTypeWrapper.contains(event.target)) {
        mapTypeWrapper.classList.remove('active');
        mapTypeToggle.setAttribute('aria-expanded', 'false');
    }
});

// OSM Buildings Controls
const osmTiltValue = document.getElementById('osmTiltValue');
const osmTiltSlider = document.getElementById('osmTiltSlider');
const osmTiltDown = document.getElementById('osmTiltDown');
const osmTiltUp = document.getElementById('osmTiltUp');
const osmRotationValue = document.getElementById('osmRotationValue');
const osmRotationSlider = document.getElementById('osmRotationSlider');
const osmRotateLeft = document.getElementById('osmRotateLeft');
const osmRotateRight = document.getElementById('osmRotateRight');
const osmToggleRotation = document.getElementById('osmToggleRotation');
const osmZoomValue = document.getElementById('osmZoomValue');
const osmZoomSlider = document.getElementById('osmZoomSlider');
const osmZoomOut = document.getElementById('osmZoomOut');
const osmZoomIn = document.getElementById('osmZoomIn');
const osmCurrentLocationBtn = document.getElementById('osmCurrentLocationBtn');
const osmResetView = document.getElementById('osmResetView');

// Direction guide elements
const directionGuide = document.getElementById('directionGuide');
const guideBuildingName = document.getElementById('guideBuildingName');
const guideBearingInfo = document.getElementById('guideBearingInfo');
const compassNeedle = document.getElementById('compassNeedle');
const compassDegree = document.getElementById('compassDegree');

// 3D Model Viewer elements
const modelSelectorButtons = document.querySelectorAll('.model-selector-btn');
const seoulModel = document.getElementById('seoul-model');
const free3dModel = document.getElementById('free3d-model');
const wrcModel = document.getElementById('wrc-model'); // Added WRC model
const modelInfoText = document.getElementById('model-info-text');
const modelDetails = document.getElementById('model-details');
const resetViewBtn = document.getElementById('reset-view');
const fullscreenBtn = document.getElementById('fullscreen-btn');

// NEW: Geodetic Measurement elements
const measureToolButtons = document.querySelectorAll('.measure-tool-btn');
const colorOptions = document.querySelectorAll('.color-option');
const symbolOptions = document.querySelectorAll('.symbol-option');
const measureStrokeSlider = document.getElementById('measureStrokeSlider');
const measureStrokeValue = document.getElementById('measureStrokeValue');
const measureOpacitySlider = document.getElementById('measureOpacitySlider');
const measureOpacityValue = document.getElementById('measureOpacityValue');
const currentTool = document.getElementById('currentTool');
const pointsCount = document.getElementById('pointsCount');
const measureResult = document.getElementById('measureResult');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const clearBtn = document.getElementById('clearBtn');
const exportBtn = document.getElementById('exportBtn');
const surveyCoordinateReadout = document.getElementById('surveyCoordinateReadout');
const surveyUtmReadout = document.getElementById('surveyUtmReadout');
const surveyLatitudeInput = document.getElementById('surveyLatitude');
const surveyLongitudeInput = document.getElementById('surveyLongitude');
const surveyBearingResult = document.getElementById('surveyBearingResult');
const bufferRadiusInput = document.getElementById('bufferRadiusInput');
const elevationLookupBtn = document.getElementById('elevationLookupBtn');
const elevationResult = document.getElementById('elevationResult');

// Login/Register Elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

// User Menu Elements
const userMenu = document.getElementById('userMenu');
const userMenuBtn = document.getElementById('userMenuBtn');
const userDropdown = document.getElementById('userDropdown');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');

let map, userMarker, userPos = null, deviceHeading = 0;
let deviceHeadingAvailable = false;
let startupFlyInActive = false;
let orientationListenerAttached = false;
let arAnimationFrameId = null;
let simulatedCameraCanvas = null;
let simulatedCameraFrameId = null;
let lastMapCoordinate = null;
let pendingSurveyPick = null;
let pendingBufferRadius = null;
let surveyStartCoordinate = null;
let surveyEndCoordinate = null;
let surveyAnalysisLayers = [];
let buildingLayers = []; // {id,name,coords,layer,color,modelUrl}
let selectedBuildingId = null;
let watchId = null;
let camStream = null;
let cameraFacingMode = 'environment';
let selectedCameraFilter = 'natural';
let cricketRuns = 0;
let cricketDeliveries = 0;
let cricketBallActive = false;
let cricketWickets = 0;
let cricketDeliveryStartedAt = 0;
let cricketDeliveryProgress = 0;
let cricketSceneState = null;
const CAMERA_FILTERS = Object.freeze({
    natural: 'none',
    vivid: 'saturate(1.5) contrast(1.08)',
    warm: 'sepia(.22) saturate(1.35)',
    mono: 'grayscale(1) contrast(1.08)'
});
let routingControl = null;
let routeFetchController = null;
let routeRequestId = 0;
let activeRouteCoordinates = null;
let usingFixed = true; // default source
let domLabel = null;
let buildingDots = []; // Store DOM elements for building dots
let miniMap = null; // Mini map instance
let miniUserMarker = null; // User marker on mini map
let miniRouteLine = null; // Route line on mini map
let miniDestinationMarker = null; // Destination marker on mini map
let routeToBuilding = null; // Current route to building
let lastRouteUpdatePos = null; // Store last position when route was updated
let totalDistance = 0; // Total distance to destination
let arrivalShown = false; // Track if arrival notification has been shown
let currentDestination = null; // Current destination building
let globalDestinationMarker = null;
let globalSearchController = null;
let osmSearchController = null;
let lastNominatimRequestAt = 0;

// NEW: Permission tracking
let locationPermissionGranted = false;
let cameraPermissionGranted = false;
let orientationPermissionGranted = false;
let orientationPermissionRequestPending = false;
let orientationPermissionRequestPromise = null;
let cameraPermissionRequested = false; // Track if camera permission has been requested

// NEW: Route type tracking
let currentRouteType = 'foot'; // Default to footpath

// NEW: Geodetic Measurement variables
let currentToolType = 'distance'; // 'distance', 'area', 'point'
let currentColor = '#FF5252';
let currentSymbol = 'circle';
let currentStrokeWidth = 3;
let currentOpacity = 0.5;
let measurementPoints = [];
let measurementHistory = [];
let historyPointer = -1;
let isDrawing = false;
let tempLayer = null;
let measurementLayers = [];

// User authentication state
let currentUser = null;
let users = JSON.parse(localStorage.getItem('arCampusUsers')) || [];

// Map layers
let currentMapLayer = null;
let mapLayers = {
    osm: null,
    satellite: null,
    satellite2: null, // Added alternative satellite
    satellite3: null, // Added Bing satellite
    terrain: null,
    cycle: null,
    transport: null
};

// OSM Buildings variables
let osmMap = null;
let currentTilt = 0;
let currentRotation = 0;
let currentZoom = 16;
let isRotating = false;
let rotationAnimationId = null;
let lastRenderTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

// NEW: Route caching for offline use
let routeCache = {};
let isUsingCachedRoute = false;

// Color palette for building dots
const BUILDING_COLORS = [
    '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE',
    '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE',
    '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40',
    '#FF6E40', '#4DB6AC', '#7986CB', '#9575CD', '#F06292'
];

// Fixed campus building list with 3D model information
const FIXED_BUILDINGS = [
    {
        id:'ric',
        name:'RIC Building',
        lat:28.255072,
        lon:83.976381,
        modelUrl: 'models/ric_building.glb',
        description: 'Research and Innovation Center - Main research facility'
    },
    {
        id:'admin',
        name:'Administrative Building',
        lat:28.255481,
        lon:83.976911,
        modelUrl: 'models/admin_building.glb',
        description: 'Main administrative building housing offices'
    },
    {
        id:'library',
        name:'Library',
        lat:28.254474527560493,
        lon:83.97617224573867,
        modelUrl: 'models/library.glb',
        description: 'Central library with study areas and resources'
    },
    {
        id:'geom',
        name:'Geomatics Department',
        lat:28.25416362191273,
        lon:83.97671891296828,
        modelUrl: 'models/geomatics.glb',
        description: 'Department of Geomatics Engineering'
    },
    {
        id:'caf',
        name:'Cafeteria',
        lat:28.253752945230495,
        lon:83.97758682897026,
        modelUrl: 'models/cafeteria.glb',
        description: 'Student cafeteria and food court'
    },
    {
        id:'park',
        name:'Park & Fountain',
        lat:28.255850,
        lon:83.976894,
        modelUrl: 'models/park.glb',
        description: 'Central park area with fountain'
    }
];

// NEW: Route type configurations with multiple service options
const ROUTE_TYPES = {
    foot: {
        name: 'Walking',
        color: '#4CAF50',
        profile: 'foot',
        serviceUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1'
    },
    car: {
        name: 'Driving',
        color: '#FF5722',
        profile: 'driving',
        serviceUrl: 'https://routing.openstreetmap.de/routed-car/route/v1'
    }
};

// Initialize the app with login - FIXED VERSION
function initApp() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('arCampusCurrentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            
            // Verify the user still exists in the users database
            const users = JSON.parse(localStorage.getItem('arCampusUsers')) || [];
            const userExists = users.find(u => u.id === currentUser.id && u.email === currentUser.email);
            
            if (userExists) {
                // User is valid, check if permissions were already granted
                const savedPermissions = localStorage.getItem('arCampusPermissions');
                if (savedPermissions) {
                    const permissions = JSON.parse(savedPermissions);
                    locationPermissionGranted = permissions.location || false;
                    cameraPermissionGranted = permissions.camera || false;
                    orientationPermissionGranted = permissions.orientation || false;
                    
                    // If permissions were already granted, skip permission request
                    if (locationPermissionGranted || cameraPermissionGranted || orientationPermissionGranted) {
                        showApp();
                    } else {
                        showPermissionRequest();
                    }
                } else {
                    showPermissionRequest();
                }
                
                // Update UI to show user is logged in
                userMenu.style.display = 'block';
                userName.textContent = currentUser.name.split(' ')[0];
                return; // Exit function, don't show login modal
            } else {
                // User data is corrupted or deleted, show login
                localStorage.removeItem('arCampusCurrentUser');
                currentUser = null;
            }
        } catch (error) {
            // If there's an error parsing, show login
            console.error('Error parsing user data:', error);
            localStorage.removeItem('arCampusCurrentUser');
            currentUser = null;
        }
    }
    
    // If no valid user found, show login modal
    showLoginModal();
}

// Show the main app - FIXED: Only called after permissions
function showApp() {
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
    permissionRequest.style.display = 'none';
    splash.style.display = 'flex';
    
    // Update user menu if logged in
    if (currentUser) {
        userMenu.style.display = 'block';
        userName.textContent = currentUser.name.split(' ')[0]; // Show first name only
    }
}

// Show permission request
function showPermissionRequest() {
    permissionRequest.style.display = 'flex';
}

// Handle permission granting
grantPermissionsBtn.addEventListener('click', async function() {
    const orientationPermission = requestOrientationPermission();
    try {
        // Start the location permission request directly from this user action.
        if (navigator.geolocation) {
            locationPermissionGranted = await new Promise(resolve => {
                navigator.geolocation.getCurrentPosition(
                    () => resolve(true),
                    error => {
                        console.warn('Location permission unavailable:', error);
                        resolve(false);
                    },
                    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
                );
            });
        }
        
        // Request camera permission
        try {
            camStream = await navigator.mediaDevices.getUserMedia({ video: true });
            cameraPermissionGranted = true;
            stopCamera(); // Stop immediately after testing
        } catch (err) {
            console.warn('Camera permission denied:', err);
            cameraPermissionGranted = false;
        }
        
        orientationPermissionGranted = await orientationPermission;
        
        // Save permissions to localStorage
        const permissions = {
            location: locationPermissionGranted,
            camera: cameraPermissionGranted,
            orientation: orientationPermissionGranted
        };
        localStorage.setItem('arCampusPermissions', JSON.stringify(permissions));
        
        permissionRequest.style.display = 'none';
        showApp();
    } catch (error) {
        console.error('Error granting permissions:', error);
        alert('Some permissions could not be granted. You can still use the app with limited functionality.');
        permissionRequest.style.display = 'none';
        showApp();
    }
});

// Handle skipping permissions
skipPermissionsBtn.addEventListener('click', function() {
    // Save that permissions were skipped
    const permissions = {
        location: false,
        camera: false,
        orientation: false
    };
    localStorage.setItem('arCampusPermissions', JSON.stringify(permissions));
    
    permissionRequest.style.display = 'none';
    showApp();
});

// NEW: Show camera permission request
function showCameraPermissionRequest() {
    cameraPermissionRequest.style.display = 'flex';
}

// NEW: Handle camera permission granting - FIXED FOR HTTPS
grantCameraPermissionBtn.addEventListener('click', async function() {
    try {
        // Check if we're in a secure context (HTTPS)
        if (window.isSecureContext) {
            console.log("Secure context detected, requesting camera access...");
            
            // Try to get camera stream with proper constraints
            const constraints = {
                video: {
                    facingMode: 'environment', // Prefer rear camera
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            };
            
            // Try multiple camera access methods
            let stream = null;
            
            try {
                // First try with ideal constraints
                stream = await navigator.mediaDevices.getUserMedia(constraints);
            } catch (err) {
                console.warn("First camera attempt failed, trying with basic constraints:", err);
                
                // Fallback to basic constraints
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ 
                        video: true, 
                        audio: false 
                    });
                } catch (fallbackErr) {
                    console.warn("Fallback camera attempt failed:", fallbackErr);
                    throw fallbackErr;
                }
            }
            
            camStream = stream;
            cameraPermissionGranted = true;
            cameraPermissionRequested = true;
            
            // Save updated permissions
            const permissions = JSON.parse(localStorage.getItem('arCampusPermissions') || '{}');
            permissions.camera = true;
            localStorage.setItem('arCampusPermissions', JSON.stringify(permissions));
            
            cameraPermissionRequest.style.display = 'none';
            
            // Continue with AR mode
            continueWithARMode();
        } else {
            // Not in secure context, show warning
            alert('Camera access requires HTTPS. Please access this app over HTTPS for full camera functionality.');
            cameraPermissionGranted = false;
            cameraPermissionRequested = true;
            
            // Save updated permissions
            const permissions = JSON.parse(localStorage.getItem('arCampusPermissions') || '{}');
            permissions.camera = false;
            localStorage.setItem('arCampusPermissions', JSON.stringify(permissions));
            
            cameraPermissionRequest.style.display = 'none';
            
            // Continue with AR mode using fallback
            continueWithARMode();
        }
    } catch (err) {
        console.warn('Camera permission denied:', err);
        cameraPermissionGranted = false;
        cameraPermissionRequested = true;
        
        // Save updated permissions
        const permissions = JSON.parse(localStorage.getItem('arCampusPermissions') || '{}');
        permissions.camera = false;
        localStorage.setItem('arCampusPermissions', JSON.stringify(permissions));
        
        cameraPermissionRequest.style.display = 'none';
        
        // Continue with AR mode using fallback
        continueWithARMode();
    }
});

// NEW: Handle skipping camera permission
skipCameraPermissionBtn.addEventListener('click', function() {
    cameraPermissionGranted = false;
    cameraPermissionRequested = true;
    
    // Save updated permissions
    const permissions = JSON.parse(localStorage.getItem('arCampusPermissions') || '{}');
    permissions.camera = false;
    localStorage.setItem('arCampusPermissions', JSON.stringify(permissions));
    
    cameraPermissionRequest.style.display = 'none';
    // Continue with AR mode using fallback
    continueWithARMode();
});

// Show login modal
function showLoginModal() {
    loginModal.style.display = 'flex';
    registerModal.style.display = 'none';
}

// Show register modal
function showRegisterModal() {
    loginModal.style.display = 'none';
    registerModal.style.display = 'flex';
}

// Handle login - FIXED VERSION
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Load fresh users data from localStorage
    const users = JSON.parse(localStorage.getItem('arCampusUsers')) || [];
    
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('arCampusCurrentUser', JSON.stringify(currentUser));
        loginModal.style.display = 'none';
        showPermissionRequest();
        
        // Update UI to show user is logged in
        userMenu.style.display = 'block';
        userName.textContent = currentUser.name.split(' ')[0];
    } else {
        alert('Invalid email or password. Please try again.');
    }
});

// Handle registration - ENHANCED VERSION
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
    }

    // Load fresh users data
    const users = JSON.parse(localStorage.getItem('arCampusUsers')) || [];
    
    if (users.find(u => u.email === email)) {
        alert('An account with this email already exists. Please log in.');
        return;
    }

    const newUser = {
        id: Date.now().toString(),
        name: fullName,
        email: email,
        password: password
    };

    users.push(newUser);
    localStorage.setItem('arCampusUsers', JSON.stringify(users));
    currentUser = newUser;
    localStorage.setItem('arCampusCurrentUser', JSON.stringify(currentUser));

    // Show success message and automatically log in
    alert('Account created successfully! You are now logged in.');
    registerModal.style.display = 'none';
    showPermissionRequest();
    
    // Update UI to show user is logged in
    userMenu.style.display = 'block';
    userName.textContent = currentUser.name.split(' ')[0];
});

// Handle logout
logoutBtn.addEventListener('click', function() {
    currentUser = null;
    localStorage.removeItem('arCampusCurrentUser');
    showLoginModal();
    userMenu.style.display = 'none';
});

// Toggle user dropdown
userMenuBtn.addEventListener('click', function() {
    userDropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!userMenu.contains(e.target)) {
        userDropdown.classList.remove('active');
    }
});

// Toggle between login and register forms - ENHANCED VERSION
showRegister.addEventListener('click', function() {
    clearFormFields();
    showRegisterModal();
});

showLogin.addEventListener('click', function() {
    clearFormFields();
    showLoginModal();
});

document.getElementById('continueAsGuest').addEventListener('click', function() {
    currentUser = null;
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
    permissionRequest.style.display = 'none';
    showApp();
});

// Utilities
function toRad(d){return d*Math.PI/180;}
function toDeg(r){return r*180/Math.PI;}
function haversine(lat1,lon1,lat2,lon2){
    const R=6371000; const dLat=toRad(lat2-lat1); const dLon=toRad(lon2-lon1);
    const a=Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
    return 2*R*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function bearing(lat1,lon1,lat2,lon2){
    const y = Math.sin(toRad(lon2-lon1)) * Math.cos(toRad(lat2));
    const x = Math.cos(toRad(lat1))*Math.sin(toRad(lat2)) - Math.sin(toRad(lat1))*Math.cos(toRad(lat2))*Math.cos(toRad(lon2-lon1));
    let br = toDeg(Math.atan2(y,x)); br=(br+360)%360; return br;
}

function latLonToENU(lat0,lon0,lat,lon){
    const x = (lon - lon0) * Math.PI/180 * 6378137 * Math.cos(toRad(lat0));
    const z = (lat - lat0) * Math.PI/180 * 6378137;
    return { x, z };
}

// FIXED: Area calculation using spherical polygon area formula
function calculateArea(coords) {
    if (coords.length < 3) return 0;
        
    const R = 6371000; // Earth radius in meters
    let area = 0;
        
    // Convert to radians
    const radCoords = coords.map(coord => ({
        lat: toRad(coord.lat),
        lon: toRad(coord.lng)
    }));
        
    // Apply spherical polygon area formula
    for (let i = 0; i < radCoords.length; i++) {
        const j = (i + 1) % radCoords.length;
        area += (radCoords[j].lon - radCoords[i].lon) * 
                (2 + Math.sin(radCoords[i].lat) + Math.sin(radCoords[j].lat));
    }
        
    area = Math.abs(area * R * R / 2);
    return area;
}

// NEW: Format distance/area for display
function formatMeasurement(value, type) {
    if (type === 'distance') {
        if (value < 1000) {
            return value.toFixed(2) + ' m';
        } else {
            return (value / 1000).toFixed(3) + ' km';
        }
    } else if (type === 'area') {
        if (value < 10000) {
            return value.toFixed(2) + ' m²';
        } else if (value < 1000000) {
            return (value / 10000).toFixed(3) + ' ha';
        } else {
            return (value / 1000000).toFixed(3) + ' km²';
        }
    }
    return value.toFixed(2);
}

// Initialize Leaflet map with multiple layers
function initMap(){
    map = L.map('map', { zoomControl:false }).setView([28.2550,83.9765], 18);

    // Define multiple map layers with high-resolution satellite options
    mapLayers.osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    });

    // High-resolution satellite tile providers
    mapLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 23, // Increased to maximum
        attribution: '© Esri, Maxar, Earthstar Geographics'
    });

    // High-resolution Google Satellite
    mapLayers.satellite2 = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 22,
        attribution: '© Google'
    });

    // Bing Maps High Resolution
    mapLayers.satellite3 = L.tileLayer('https://ecn.t3.tiles.virtualearth.net/tiles/a{q}.jpeg?g=1', {
        maxZoom: 21,
        attribution: '© Microsoft Bing Maps',
        subdomains: ['t0', 't1', 't2', 't3']
    });

    mapLayers.terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: '© OpenTopoMap contributors'
    });

    mapLayers.cycle  = L.tileLayer('https://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });

    mapLayers.transport = L.tileLayer('https://tile.memomaps.de/tilegen/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
    });

    // Add default layer
    currentMapLayer = mapLayers.osm;
    currentMapLayer.addTo(map);

    // L.control.zoom({ position: '' }).addTo(map);

    // NEW: Initialize measurement tools
    initMeasurementTools();
}

// NEW: Initialize measurement tools
function initMeasurementTools() {
    // Add click event listener to map for measurement
    map.on('click', function(e) {
        lastMapCoordinate = { lat: e.latlng.lat, lng: e.latlng.lng };
        updateSurveyCoordinateDisplay(lastMapCoordinate);

        if (pendingSurveyPick) {
            captureSurveyPoint(pendingSurveyPick, lastMapCoordinate);
            return;
        }

        if (pendingBufferRadius !== null) {
            drawSurveyBuffer(lastMapCoordinate, pendingBufferRadius);
            pendingBufferRadius = null;
            return;
        }

        if (measureControls.style.display !== 'block') return;
        
        if (currentToolType === 'point') {
            addMeasurementPoint(e.latlng);
        } else if (currentToolType === 'distance' || currentToolType === 'area') {
            if (!isDrawing) {
                startMeasurement(e.latlng);
            } else {
                addMeasurementPoint(e.latlng);
            }
        }
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            undoMeasurement();
        } else if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            redoMeasurement();
        }
    });

    // Update measurement controls
    updateMeasurementControls();
}

// NEW: Start measurement
function startMeasurement(latlng) {
    isDrawing = true;
    measurementPoints = [];
    saveToHistory();
    addMeasurementPoint(latlng);
}

// NEW: Add measurement point
function addMeasurementPoint(latlng) {
    if (!isDrawing && currentToolType !== 'point') return;

    measurementPoints.push(latlng);
    saveToHistory();

    // Create marker with selected symbol and color
    const marker = L.marker(latlng, {
        icon: L.divIcon({
            className: 'measurement-marker',
            html: getSymbolHTML(currentSymbol, currentColor),
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        })
    }).addTo(map);

    // Add popup with coordinates
    marker.bindPopup(`
        <strong>Point ${measurementPoints.length}</strong><br>
        Lat: ${latlng.lat.toFixed(6)}<br>
        Lon: ${latlng.lng.toFixed(6)}
    `).openPopup();

    measurementLayers.push(marker);

    // Update measurement display
    updateMeasurementDisplay();

    // Draw lines for distance and area tools
    if (currentToolType === 'distance' && measurementPoints.length > 1) {
        const line = L.polyline(measurementPoints, {
            color: currentColor,
            weight: currentStrokeWidth,
            opacity: 0.8
        }).addTo(map);
        measurementLayers.push(line);
        
        // Calculate and display distance
        const distance = calculateDistance(measurementPoints);
        measureResult.textContent = formatMeasurement(distance, 'distance');
    } else if (currentToolType === 'area' && measurementPoints.length > 2) {
        const polygon = L.polygon(measurementPoints, {
            color: currentColor,
            weight: currentStrokeWidth,
            opacity: 0.8,
            fillColor: currentColor,
            fillOpacity: currentOpacity
        }).addTo(map);
        measurementLayers.push(polygon);
        
        // Calculate and display area
        const area = calculateArea(measurementPoints);
        measureResult.textContent = formatMeasurement(area, 'area');
    }
}

// NEW: Calculate distance between points
function calculateDistance(points) {
    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
        totalDistance += haversine(
            points[i-1].lat, points[i-1].lng,
            points[i].lat, points[i].lng
        );
    }
    return totalDistance;
}

function formatDMS(value, isLatitude) {
    const absolute = Math.abs(value);
    const degrees = Math.floor(absolute);
    const minutesFloat = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesFloat);
    const seconds = ((minutesFloat - minutes) * 60).toFixed(2);
    const hemisphere = isLatitude
        ? (value < 0 ? 'S' : 'N')
        : (value < 0 ? 'W' : 'E');
    return `${degrees}° ${minutes}' ${seconds}" ${hemisphere}`;
}

function toWgs84Utm(lat, lon) {
    if (lat < -80 || lat > 84) return null;

    const a = 6378137;
    const eccentricitySquared = 0.00669438;
    const secondEccentricitySquared = eccentricitySquared / (1 - eccentricitySquared);
    const scale = 0.9996;
    const latitude = toRad(lat);
    const longitude = toRad(lon);
    const zone = Math.min(60, Math.max(1, Math.floor((lon + 180) / 6) + 1));
    const centralMeridian = toRad((zone - 1) * 6 - 180 + 3);
    const sinLatitude = Math.sin(latitude);
    const cosLatitude = Math.cos(latitude);
    const tangentLatitude = Math.tan(latitude);
    const n = a / Math.sqrt(1 - eccentricitySquared * sinLatitude * sinLatitude);
    const t = tangentLatitude * tangentLatitude;
    const c = secondEccentricitySquared * cosLatitude * cosLatitude;
    const aa = cosLatitude * (longitude - centralMeridian);
    const meridianArc = a * (
        (1 - eccentricitySquared / 4 - 3 * eccentricitySquared ** 2 / 64 - 5 * eccentricitySquared ** 3 / 256) * latitude
        - (3 * eccentricitySquared / 8 + 3 * eccentricitySquared ** 2 / 32 + 45 * eccentricitySquared ** 3 / 1024) * Math.sin(2 * latitude)
        + (15 * eccentricitySquared ** 2 / 256 + 45 * eccentricitySquared ** 3 / 1024) * Math.sin(4 * latitude)
        - (35 * eccentricitySquared ** 3 / 3072) * Math.sin(6 * latitude)
    );
    const easting = scale * n * (
        aa + (1 - t + c) * aa ** 3 / 6
        + (5 - 18 * t + t ** 2 + 72 * c - 58 * secondEccentricitySquared) * aa ** 5 / 120
    ) + 500000;
    let northing = scale * (
        meridianArc + n * tangentLatitude * (
            aa ** 2 / 2
            + (5 - t + 9 * c + 4 * c ** 2) * aa ** 4 / 24
            + (61 - 58 * t + t ** 2 + 600 * c - 330 * secondEccentricitySquared) * aa ** 6 / 720
        )
    );
    const hemisphere = lat < 0 ? 'S' : 'N';
    if (lat < 0) northing += 10000000;

    return {
        zone,
        band: 'CDEFGHJKLMNPQRSTUVWX'[Math.min(19, Math.floor((lat + 80) / 8))],
        hemisphere,
        easting: Math.round(easting),
        northing: Math.round(northing)
    };
}

function updateSurveyCoordinateDisplay(coordinate) {
    const lat = Number(coordinate.lat);
    const lon = Number(coordinate.lng ?? coordinate.lon);
    surveyCoordinateReadout.textContent =
        `${lat.toFixed(6)}, ${lon.toFixed(6)} · ${formatDMS(lat, true)} · ${formatDMS(lon, false)}`;

    const utm = toWgs84Utm(lat, lon);
    surveyUtmReadout.textContent = utm
        ? `UTM ${utm.zone}${utm.band} (${utm.hemisphere}) · E ${utm.easting.toLocaleString()} m · N ${utm.northing.toLocaleString()} m`
        : 'UTM unavailable beyond 80°S–84°N';
}

function captureSurveyPoint(which, coordinate) {
    const captured = { lat: coordinate.lat, lng: coordinate.lng };
    const marker = L.circleMarker([captured.lat, captured.lng], {
        radius: 7,
        color: '#fff',
        weight: 2,
        fillColor: which === 'start' ? '#2a7bff' : '#f06449',
        fillOpacity: 1
    }).addTo(map);
    marker.bindPopup(`Survey point ${which === 'start' ? 'A' : 'B'}`);
    marker.feature = {
        type: 'Feature',
        properties: { tool: 'inverse', point: which === 'start' ? 'A' : 'B' }
    };
    surveyAnalysisLayers.push(marker);

    if (which === 'start') {
        surveyStartCoordinate = captured;
        surveyBearingResult.textContent = 'Point A captured · choose point B';
    } else {
        surveyEndCoordinate = captured;
        if (surveyStartCoordinate) {
            const distance = haversine(
                surveyStartCoordinate.lat, surveyStartCoordinate.lng,
                captured.lat, captured.lng
            );
            const azimuth = bearing(
                surveyStartCoordinate.lat, surveyStartCoordinate.lng,
                captured.lat, captured.lng
            );
            const cardinal = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(azimuth / 45) % 8];
            surveyBearingResult.textContent = `A → B · ${formatMeasurement(distance, 'distance')} · ${azimuth.toFixed(2)}° ${cardinal}`;
            const line = L.polyline(
                [[surveyStartCoordinate.lat, surveyStartCoordinate.lng], [captured.lat, captured.lng]],
                { color: '#2a7bff', weight: 3, dashArray: '7 7' }
            ).addTo(map);
            line.feature = { type: 'Feature', properties: { tool: 'inverse-line', distance_m: Number(distance.toFixed(3)), azimuth_deg: Number(azimuth.toFixed(3)) } };
            surveyAnalysisLayers.push(line);
            map.fitBounds(line.getBounds(), { padding: [36, 36], maxZoom: 19 });
        } else {
            surveyBearingResult.textContent = 'Choose point A before point B';
        }
    }
    pendingSurveyPick = null;
    document.getElementById('pickStartPointBtn').classList.remove('active');
    document.getElementById('pickEndPointBtn').classList.remove('active');
    infoBox.textContent = `Survey point ${which === 'start' ? 'A' : 'B'} captured`;
}

function drawSurveyBuffer(coordinate, radius) {
    const buffer = L.circle([coordinate.lat, coordinate.lng], {
        radius,
        color: '#7c4dff',
        weight: 2,
        fillColor: '#7c4dff',
        fillOpacity: 0.16
    }).addTo(map);
    buffer.feature = { type: 'Feature', properties: { tool: 'geodesic-buffer', radius_m: radius } };
    surveyAnalysisLayers.push(buffer);
    map.fitBounds(buffer.getBounds(), { padding: [36, 36] });
    infoBox.textContent = `${radius.toLocaleString()} m buffer created · export as GeoJSON`;
}

function exportSurveyGeoJson() {
    const features = surveyAnalysisLayers.map(layer => {
        const feature = layer.toGeoJSON();
        feature.properties = {
            ...(layer.feature?.properties || {}),
            source_crs: 'EPSG:4326'
        };
        return feature;
    });

    if (measurementPoints.length) {
        const coordinates = measurementPoints.map(point => [point.lng, point.lat]);
        features.push(...measurementPoints.map((point, index) => ({
            type: 'Feature',
            properties: { tool: 'measurement-vertex', index: index + 1, source_crs: 'EPSG:4326' },
            geometry: { type: 'Point', coordinates: [point.lng, point.lat] }
        })));

        if (currentToolType === 'distance' && coordinates.length > 1) {
            features.push({
                type: 'Feature',
                properties: { tool: 'geodesic-distance', distance: measureResult.textContent, source_crs: 'EPSG:4326' },
                geometry: { type: 'LineString', coordinates }
            });
        } else if (currentToolType === 'area' && coordinates.length > 2) {
            const ring = [...coordinates, coordinates[0]];
            features.push({
                type: 'Feature',
                properties: { tool: 'geodesic-area', area: measureResult.textContent, source_crs: 'EPSG:4326' },
                geometry: { type: 'Polygon', coordinates: [ring] }
            });
        }
    }

    if (lastMapCoordinate) {
        features.push({
            type: 'Feature',
            properties: { tool: 'captured-coordinate', source_crs: 'EPSG:4326' },
            geometry: { type: 'Point', coordinates: [lastMapCoordinate.lng, lastMapCoordinate.lat] }
        });
    }

    if (!features.length) {
        infoBox.textContent = 'Add a survey point, measurement, or buffer before exporting GeoJSON.';
        return;
    }

    const collection = {
        type: 'FeatureCollection',
        name: 'WRC Campus Survey',
        features
    };
    const blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wrc-survey-${new Date().toISOString().slice(0, 10)}.geojson`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    infoBox.textContent = `${features.length} survey features exported as WGS 84 GeoJSON`;
}

async function sampleElevation() {
    const coordinate = lastMapCoordinate || userPos;
    if (!coordinate) {
        elevationResult.textContent = 'Tap the map or enable GPS before sampling elevation.';
        return;
    }

    elevationLookupBtn.disabled = true;
    elevationResult.textContent = 'Requesting elevation sample…';
    try {
        const lat = Number(coordinate.lat);
        const lon = Number(coordinate.lng ?? coordinate.lon);
        const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`);
        if (!response.ok) throw new Error(`Elevation service returned HTTP ${response.status}`);
        const result = await response.json();
        const elevation = result.results?.[0]?.elevation;
        if (!Number.isFinite(elevation)) throw new Error('Elevation service returned no elevation for this point');
        elevationResult.textContent = `Terrain elevation · ${elevation.toFixed(1)} m`;
        infoBox.textContent = `Elevation sample: ${elevation.toFixed(1)} m · terrain-model estimate`;
    } catch (error) {
        console.error('Elevation lookup failed:', error);
        elevationResult.textContent = 'Elevation lookup failed. Check your connection and try again.';
        infoBox.textContent = 'Elevation service unavailable; no sample was recorded.';
    } finally {
        elevationLookupBtn.disabled = false;
    }
}

function initSurveyTools() {
    document.getElementById('copyCoordinatesBtn').addEventListener('click', async function() {
        const coordinate = lastMapCoordinate || userPos;
        if (!coordinate) {
            infoBox.textContent = 'Tap the map or enable GPS before copying coordinates.';
            return;
        }

        const value = `${Number(coordinate.lat).toFixed(6)}, ${Number(coordinate.lng ?? coordinate.lon).toFixed(6)}`;
        try {
            await navigator.clipboard.writeText(value);
            infoBox.textContent = `Copied WGS 84 coordinates: ${value}`;
        } catch (error) {
            console.error('Unable to copy coordinates:', error);
            infoBox.textContent = 'Clipboard access is unavailable. Select and copy the coordinate from the survey readout.';
        }
    });

    document.getElementById('goToCoordinateBtn').addEventListener('click', function() {
        const lat = Number(surveyLatitudeInput.value);
        const lon = Number(surveyLongitudeInput.value);
        if (!surveyLatitudeInput.value || !surveyLongitudeInput.value || !Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            infoBox.textContent = 'Enter a valid WGS 84 latitude (−90 to 90) and longitude (−180 to 180).';
            return;
        }

        const coordinate = { lat, lng: lon };
        lastMapCoordinate = coordinate;
        updateSurveyCoordinateDisplay(coordinate);
        map.flyTo([lat, lon], 18, { duration: 0.8 });
        const marker = L.marker([lat, lon]).addTo(map).bindPopup('Survey coordinate · WGS 84').openPopup();
        marker.feature = { type: 'Feature', properties: { tool: 'coordinate-navigation', source_crs: 'EPSG:4326' } };
        surveyAnalysisLayers.push(marker);
        infoBox.textContent = `Map centered on ${lat.toFixed(6)}, ${lon.toFixed(6)} · WGS 84`;
    });

    document.getElementById('pickStartPointBtn').addEventListener('click', function() {
        pendingSurveyPick = 'start';
        this.classList.add('active');
        document.getElementById('pickEndPointBtn').classList.remove('active');
        surveyBearingResult.textContent = 'Tap the map to capture point A';
    });

    document.getElementById('pickEndPointBtn').addEventListener('click', function() {
        pendingSurveyPick = 'end';
        this.classList.add('active');
        document.getElementById('pickStartPointBtn').classList.remove('active');
        surveyBearingResult.textContent = surveyStartCoordinate
            ? 'Tap the map to capture point B'
            : 'Point A is required first · tap the map to capture B';
    });

    document.getElementById('drawBufferBtn').addEventListener('click', function() {
        const radius = Number(bufferRadiusInput.value);
        if (!Number.isFinite(radius) || radius < 1 || radius > 100000) {
            infoBox.textContent = 'Enter a buffer radius between 1 and 100,000 metres.';
            return;
        }

        pendingBufferRadius = radius;
        pendingSurveyPick = null;
        document.getElementById('pickStartPointBtn').classList.remove('active');
        document.getElementById('pickEndPointBtn').classList.remove('active');
        this.classList.add('active');
        infoBox.textContent = `Tap the map to place the centre of your ${radius.toLocaleString()} m buffer.`;
    });

    document.getElementById('exportGeoJsonBtn').addEventListener('click', exportSurveyGeoJson);
    document.getElementById('clearSurveyDataBtn').addEventListener('click', function() {
        surveyAnalysisLayers.forEach(layer => {
            if (map.hasLayer(layer)) map.removeLayer(layer);
        });
        surveyAnalysisLayers = [];
        surveyStartCoordinate = null;
        surveyEndCoordinate = null;
        pendingSurveyPick = null;
        pendingBufferRadius = null;
        surveyBearingResult.textContent = 'Choose A and B on the map';
        elevationResult.textContent = 'Elevation sample uses Open-Elevation';
        document.getElementById('pickStartPointBtn').classList.remove('active');
        document.getElementById('pickEndPointBtn').classList.remove('active');
        document.getElementById('drawBufferBtn').classList.remove('active');
        infoBox.textContent = 'Survey features cleared.';
    });
    elevationLookupBtn.addEventListener('click', sampleElevation);
}

// NEW: Get symbol HTML
function getSymbolHTML(symbol, color) {
    switch(symbol) {
        case 'circle':
            return `<div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 0 5px rgba(0,0,0,0.5)"></div>`;
        case 'square':
            return `<div style="background:${color};width:12px;height:12px;border:2px solid white;box-shadow:0 0 5px rgba(0,0,0,0.5)"></div>`;
        case 'triangle':
            return `<div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:12px solid ${color};border-top:none"></div>`;
        case 'star':
            return `<div style="color:${color};font-size:16px;text-shadow:0 0 3px white;">★</div>`;
        case 'pin':
            return `<div style="color:${color};font-size:16px;text-shadow:0 0 3px white;"></div>`;
        default:
            return `<div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 0 5px rgba(0,0,0,0.5)"></div>`;
    }
}

// NEW: Update measurement display
function updateMeasurementDisplay() {
    pointsCount.textContent = measurementPoints.length;
}

// NEW: Save to history
function saveToHistory() {
    // Remove any future history if we're not at the end
    if (historyPointer < measurementHistory.length - 1) {
        measurementHistory = measurementHistory.slice(0, historyPointer + 1);
    }

    measurementHistory.push({
        points: [...measurementPoints],
        layers: [...measurementLayers]
    });

    historyPointer = measurementHistory.length - 1;
    updateUndoRedoButtons();
}

// NEW: Undo measurement
function undoMeasurement() {
    if (historyPointer > 0) {
        historyPointer--;
        restoreFromHistory();
    }
}

// NEW: Redo measurement
function redoMeasurement() {
    if (historyPointer < measurementHistory.length - 1) {
        historyPointer++;
        restoreFromHistory();
    }
}

// NEW: Restore from history
function restoreFromHistory() {
    // Clear current layers
    clearMeasurementLayers();

    // Restore from history
    const state = measurementHistory[historyPointer];
    measurementPoints = [...state.points];
    measurementLayers = [];

    // Redraw layers
    if (measurementPoints.length > 0) {
        if (currentToolType === 'point') {
            // Redraw all points
            measurementPoints.forEach((point, index) => {
                const marker = L.marker(point, {
                    icon: L.divIcon({
                        className: 'measurement-marker',
                        html: getSymbolHTML(currentSymbol, currentColor),
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                }).addTo(map);
                
                marker.bindPopup(`
                    <strong>Point ${index + 1}</strong><br>
                    Lat: ${point.lat.toFixed(6)}<br>
                    Lon: ${point.lng.toFixed(6)}
                `);
                
                measurementLayers.push(marker);
            });
        } else if (currentToolType === 'distance' && measurementPoints.length > 1) {
            // Redraw points and line
            measurementPoints.forEach((point, index) => {
                const marker = L.marker(point, {
                    icon: L.divIcon({
                        className: 'measurement-marker',
                        html: getSymbolHTML(currentSymbol, currentColor),
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                }).addTo(map);
                
                marker.bindPopup(`
                    <strong>Point ${index + 1}</strong><br>
                    Lat: ${point.lat.toFixed(6)}<br>
                    Lon: ${point.lng.toFixed(6)}
                `);
                
                measurementLayers.push(marker);
            });
            
            const line = L.polyline(measurementPoints, {
                color: currentColor,
                weight: currentStrokeWidth,
                opacity: 0.8
            }).addTo(map);
            measurementLayers.push(line);
            
            const distance = calculateDistance(measurementPoints);
            measureResult.textContent = formatMeasurement(distance, 'distance');
        } else if (currentToolType === 'area' && measurementPoints.length > 2) {
            // Redraw points and polygon
            measurementPoints.forEach((point, index) => {
                const marker = L.marker(point, {
                    icon: L.divIcon({
                        className: 'measurement-marker',
                        html: getSymbolHTML(currentSymbol, currentColor),
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                }).addTo(map);
                
                marker.bindPopup(`
                    <strong>Point ${index + 1}</strong><br>
                    Lat: ${point.lat.toFixed(6)}<br>
                    Lon: ${point.lng.toFixed(6)}
                `);
                
                measurementLayers.push(marker);
            });
            
            const polygon = L.polygon(measurementPoints, {
                color: currentColor,
                weight: currentStrokeWidth,
                opacity: 0.8,
                fillColor: currentColor,
                fillOpacity: currentOpacity
            }).addTo(map);
            measurementLayers.push(polygon);
            
            const area = calculateArea(measurementPoints);
            measureResult.textContent = formatMeasurement(area, 'area');
        }
    }

    updateMeasurementDisplay();
    updateUndoRedoButtons();
}

// NEW: Clear measurement layers
function clearMeasurementLayers() {
    measurementLayers.forEach(layer => {
        if (layer && map.hasLayer(layer)) {
            map.removeLayer(layer);
        }
    });
    measurementLayers = [];
}

// NEW: Update undo/redo buttons
function updateUndoRedoButtons() {
    undoBtn.disabled = historyPointer <= 0;
    redoBtn.disabled = historyPointer >= measurementHistory.length - 1;
}

// NEW: Clear all measurements
function clearMeasurements() {
    clearMeasurementLayers();
    measurementPoints = [];
    measurementHistory = [];
    historyPointer = -1;
    measureResult.textContent = '-';
    updateMeasurementDisplay();
    updateUndoRedoButtons();
    saveToHistory();
}

// NEW: Export measurement data
function exportMeasurements() {
    if (measurementPoints.length === 0) {
        alert('No measurement data to export');
        return;
    }

    let data = '';
    if (currentToolType === 'point') {
        data = 'Point Measurements\n';
        data += 'Index,Latitude,Longitude\n';
        measurementPoints.forEach((point, index) => {
            data += `${index + 1},${point.lat.toFixed(6)},${point.lng.toFixed(6)}\n`;
        });
    } else if (currentToolType === 'distance') {
        data = 'Distance Measurement\n';
        data += 'Total Distance: ' + measureResult.textContent + '\n\n';
        data += 'Points:\n';
        data += 'Index,Latitude,Longitude\n';
        measurementPoints.forEach((point, index) => {
            data += `${index + 1},${point.lat.toFixed(6)},${point.lng.toFixed(6)}\n`;
        });
    } else if (currentToolType === 'area') {
        data = 'Area Measurement\n';
        data += 'Total Area: ' + measureResult.textContent + '\n\n';
        data += 'Points:\n';
        data += 'Index,Latitude,Longitude\n';
        measurementPoints.forEach((point, index) => {
            data += `${index + 1},${point.lat.toFixed(6)},${point.lng.toFixed(6)}\n`;
        });
    }

    // Create and download file
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `measurement_${currentToolType}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// NEW: Update measurement controls
function updateMeasurementControls() {
    measureStrokeValue.textContent = currentStrokeWidth + 'px';
    measureOpacityValue.textContent = (currentOpacity).toFixed(1);
}

// NEW: Change measurement tool
function changeMeasurementTool(tool) {
    currentToolType = tool;
    isDrawing = false;
    clearMeasurements();

    // Update tool buttons
    measureToolButtons.forEach(btn => {
        if (btn.getAttribute('data-tool') === tool) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update tool description
    switch(tool) {
        case 'distance':
            currentTool.textContent = 'Distance Measurement';
            break;
        case 'area':
            currentTool.textContent = 'Area Measurement';
            break;
        case 'point':
            currentTool.textContent = 'Point Measurement';
            break;
    }

    infoBox.textContent = `Measurement tool changed to ${currentTool.textContent}`;
}

// NEW: Change measurement color
function changeMeasurementColor(color) {
    currentColor = color;
    colorOptions.forEach(option => {
        if (option.getAttribute('data-color') === color) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });

    // Redraw with new color
    if (measurementPoints.length > 0) {
        const currentState = {
            points: [...measurementPoints],
            layers: [...measurementLayers]
        };
        clearMeasurementLayers();
        measurementPoints = currentState.points;
        restoreFromHistory();
    }
}

// NEW: Change measurement symbol
function changeMeasurementSymbol(symbol) {
    currentSymbol = symbol;
    symbolOptions.forEach(option => {
        if (option.getAttribute('data-symbol') === symbol) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });

    // Redraw with new symbol
    if (measurementPoints.length > 0) {
        const currentState = {
            points: [...measurementPoints],
            layers: [...measurementLayers]
        };
        clearMeasurementLayers();
        measurementPoints = currentState.points;
        restoreFromHistory();
    }
}

// NEW: Route type selection
function changeRouteType(type) {
    currentRouteType = type;
    routeTypeButtons.forEach(btn => {
        if (btn.getAttribute('data-type') === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if (currentDestination) {
        const selectedBuilding = selectedBuildingId
            ? buildingLayers.find(building => String(building.id) === String(selectedBuildingId))
            : null;
        const destination = selectedBuilding
            ? computeCentroid(selectedBuilding.coords)
            : currentDestination;
        if (Number.isFinite(destination.lat) && Number.isFinite(destination.lon)) {
            showRouteTo(destination.lat, destination.lon);
            lastRouteUpdatePos = userPos ? { lat: userPos.lat, lon: userPos.lon } : null;
        }
    }

    infoBox.textContent = `Route type changed to ${ROUTE_TYPES[type].name}`;
}

// Change map type
function changeMapType(type) {
    if (currentMapLayer) {
        map.removeLayer(currentMapLayer);
    }

    // Special handling for satellite to ensure high-resolution imagery
    if (type === 'satellite') {
        // Try multiple high-resolution satellite providers in order of quality
        const satelliteProviders = [
            mapLayers.satellite2, // Google (usually highest resolution)
            mapLayers.satellite,  // Esri
            mapLayers.satellite3, // Bing
        ];

        let providerAdded = false;
        for (let provider of satelliteProviders) {
            try {
                currentMapLayer = provider;
                currentMapLayer.addTo(map);
                providerAdded = true;
                console.log(`Using satellite provider: ${provider._url}`);
                break;
            } catch (e) {
                console.log(`Satellite provider failed: ${e.message}`);
                continue;
            }
        }

        if (!providerAdded) {
            // Ultimate fallback
            currentMapLayer = mapLayers.osm;
            currentMapLayer.addTo(map);
            infoBox.textContent = 'Satellite not available, using standard map';
        }

        // Force higher zoom for better detail
        if (map.getZoom() < 18) {
            map.setZoom(18);
        }
    } else {
        currentMapLayer = mapLayers[type];
        if (currentMapLayer) {
            currentMapLayer.addTo(map);
        }
    }

    // Update active button
    mapTypeButtons.forEach(btn => {
        if (btn.getAttribute('data-type') === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    closeMapTypeMenu();
}

// Add close button
const closeBtn = document.createElement('button');
closeBtn.className = 'osm-close-btn';
closeBtn.innerHTML = '×';
closeBtn.title = 'Close controls';
closeBtn.onclick = () => {
    document.getElementById('osmControls').classList.remove('full-viz-mode');
};

// Toggle function
function toggleFullVizMode() {
    const controls = document.getElementById('osmControls');
    controls.classList.toggle('full-viz-mode');
    
    if (controls.classList.contains('full-viz-mode')) {
        controls.appendChild(closeBtn);
    } else if (closeBtn.parentNode === controls) {
        controls.removeChild(closeBtn);
    }
}

// Trigger mode based on screen size or user preference
function checkScreenSize() {
    const controls = document.getElementById('osmControls');
    controls.classList.remove('full-viz-mode');
    if (closeBtn.parentNode === controls) controls.removeChild(closeBtn);
}

// Initialize
window.addEventListener('resize', checkScreenSize);
checkScreenSize();

// Search for locations worldwide
async function queryNominatim(query, limit, signal) {
    const wait = Math.max(0, 1100 - (Date.now() - lastNominatimRequestAt));
    if (wait) {
        await new Promise(resolve => setTimeout(resolve, wait));
    }
    if (signal.aborted) {
        throw new DOMException('Place search was cancelled.', 'AbortError');
    }

    lastNominatimRequestAt = Date.now();
    const params = new URLSearchParams({
        q: query,
        format: 'jsonv2',
        limit: String(limit)
    });
    const response = await fetch(`${NOMINATIM_URL}?${params}`, { signal });
    if (!response.ok) {
        throw new Error(`Place search returned HTTP ${response.status}.`);
    }
    const places = await response.json();
    if (!Array.isArray(places)) {
        throw new Error('Place search returned an unexpected response.');
    }
    return places;
}

let osmSearchDebounceTimer = null;
async function searchLocation(query) {
    if (!query || query.length < 3) {
        osmSearchResults.style.display = 'none';
        return;
    }

    if (osmSearchController) {
        osmSearchController.abort();
    }
    const controller = new AbortController();
    osmSearchController = controller;
    osmSearchResults.textContent = 'Searching OpenStreetMap…';
    osmSearchResults.style.display = 'block';
    try {
        const results = await queryNominatim(query, 5, controller.signal);
        if (controller.signal.aborted) return;
        displaySearchResults(results);
    } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Search error:', error);
        osmSearchResults.textContent = error.message || 'Search failed. Please try again.';
    } finally {
        if (osmSearchController === controller) {
            osmSearchController = null;
        }
    }
}

// Display search results
function displaySearchResults(results) {
    osmSearchResults.innerHTML = '';

    if (results.length === 0) {
        osmSearchResults.innerHTML = '<div class="search-result-item">No results found</div>';
        osmSearchResults.style.display = 'block';
        return;
    }

    results.forEach(result => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        const name = document.createElement('div');
        name.className = 'search-result-name';
        name.textContent = result.display_name || 'Unnamed place';
        const type = document.createElement('div');
        type.className = 'search-result-type';
        type.textContent = `${result.type || 'Place'} · ${result.category || result.class || 'OpenStreetMap'}`;
        item.append(name, type);

        item.addEventListener('click', () => {
            const lat = parseFloat(result.lat);
            const lon = parseFloat(result.lon);
            // Navigate OSM Buildings to the searched location
            if (osmMap) {
                osmMap.setPosition({ latitude: lat, longitude: lon });
                osmMap.setZoom(16);
            }
            osmSearchInput.value = result.display_name;
            osmSearchResults.style.display = 'none';
            infoBox.textContent = `Location: ${result.display_name}`;
        });

        osmSearchResults.appendChild(item);
    });

    osmSearchResults.style.display = 'block';
}

// Initialize slide-over mode for measurement controls
function initMeasureSlideOver() {
    const controls = document.getElementById('measureControls');
    
    // Create drag handle
    const dragHandle = document.createElement('div');
    dragHandle.className = 'measure-drag-handle';
    dragHandle.title = 'Drag to expand/collapse measurement controls';
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'measure-close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.title = 'Close expanded view';
    
    // Create content wrapper
    const contentArea = document.createElement('div');
    contentArea.className = 'measure-content-area';
    
    // Move existing content into wrapper
    while (controls.firstChild) {
        contentArea.appendChild(controls.firstChild);
    }
    
    // Add new elements
    controls.appendChild(dragHandle);
    controls.appendChild(closeBtn);
    controls.appendChild(contentArea);
    
    // Toggle expand/collapse
    function toggleExpand() {
        controls.classList.toggle('expanded');
        controls.style.height = controls.classList.contains('expanded') 
            ? '100vh' 
            : '35vh';
    }
    
    // Event listeners
    closeBtn.onclick = toggleExpand;
    dragHandle.ondblclick = toggleExpand;
    
    // Make header clickable to expand
    const header = controls.querySelector('h3');
    if (header) {
        header.style.cursor = 'pointer';
        header.onclick = () => {
            if (!controls.classList.contains('expanded')) {
                toggleExpand();
            }
        };
    }
    
    // Enable drag functionality
    let isDragging = false;
    let startY = 0;
    let startHeight = 0;
    
    dragHandle.addEventListener('touchstart', startDrag);
    dragHandle.addEventListener('mousedown', startDrag);
    
    function startDrag(e) {
        isDragging = true;
        startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        startHeight = controls.offsetHeight;
        
        document.addEventListener('touchmove', onDrag);
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('touchend', stopDrag);
        document.addEventListener('mouseup', stopDrag);
        
        controls.style.transition = 'none';
        e.preventDefault();
    }
    
    function onDrag(e) {
        if (!isDragging) return;
        
        const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        const deltaY = startY - currentY;
        const newHeight = startHeight + deltaY;
        const windowHeight = window.innerHeight;
        
        if (newHeight > windowHeight * 0.8) {
            controls.classList.add('expanded');
            controls.style.height = '100vh';
        } else if (newHeight < windowHeight * 0.3) {
            controls.classList.remove('expanded');
            controls.style.height = '35vh';
        } else {
            controls.style.height = `${newHeight}px`;
        }
    }
    
    function stopDrag() {
        isDragging = false;
        controls.style.transition = '';
    }
    
    // Auto-activate slide-over mode on mobile
    if (window.innerWidth <= 768) {
        controls.classList.add('slide-over-mode');
    }
}

// Run when measurement controls are shown
function showMeasureControls() {
    const controls = document.getElementById('measureControls');
    controls.style.display = 'block';
    
    // Initialize slide-over mode if needed
    if (window.innerWidth <= 768 && !controls.classList.contains('slide-over-mode')) {
        initMeasureSlideOver();
    }
}

// Hide measurement controls
function hideMeasureControls() {
    document.getElementById('measureControls').style.display = 'none';
}

// Add resize listener to adjust mode
window.addEventListener('resize', function() {
    if (map) map.invalidateSize({ pan: false });
});

// FIXED: Update direction indicator with proper positioning and rotation
function updateDirectionIndicator() {
    if (!currentDestination || !routeToBuilding || !userPos) {
        directionIndicator.style.display = 'none';
        directionGuide.style.display = 'none';
        return;
    }

    const selectedBuilding = selectedBuildingId
        ? buildingLayers.find(building => String(building.id) === String(selectedBuildingId))
        : null;
    const destination = selectedBuilding
        ? computeCentroid(selectedBuilding.coords)
        : { lat: currentDestination.lat, lon: currentDestination.lon };
    if (!Number.isFinite(destination.lat) || !Number.isFinite(destination.lon)) {
        directionIndicator.style.display = 'none';
        directionGuide.style.display = 'none';
        return;
    }

    const destinationName = currentDestination.name || selectedBuilding?.name || 'Destination';
    const dist = haversine(userPos.lat, userPos.lon, destination.lat, destination.lon);
    guideBuildingName.textContent = destinationName;
    const bearingElement = guideBearingInfo.querySelector('.bearing-value');
    const distanceElement = guideBearingInfo.querySelector('.distance-value');
    if (!deviceHeadingAvailable) {
        bearingElement.textContent = 'Compass unavailable';
        distanceElement.textContent = `${dist.toFixed(2)}m`;
        directionGuide.style.display = 'block';
        directionIndicator.style.display = 'none';
        return;
    }

    let guidanceTarget = destination;
    if (activeRouteCoordinates && activeRouteCoordinates.length > 1) {
        let nearestIndex = 0;
        let nearestDistance = Infinity;
        activeRouteCoordinates.forEach((coordinate, index) => {
            const distance = haversine(userPos.lat, userPos.lon, coordinate[1], coordinate[0]);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestIndex = index;
            }
        });

        for (let index = nearestIndex + 1; index < activeRouteCoordinates.length; index += 1) {
            const coordinate = activeRouteCoordinates[index];
            if (haversine(userPos.lat, userPos.lon, coordinate[1], coordinate[0]) >= 10) {
                guidanceTarget = { lat: coordinate[1], lon: coordinate[0] };
                break;
            }
        }
    }
    const br = bearing(userPos.lat, userPos.lon, guidanceTarget.lat, guidanceTarget.lon);

    // Calculate relative bearing (how much to turn from current heading)
    const rel = ((br - deviceHeading + 540) % 360) - 180;

    // Update direction guide with FLOAT values
    guideBuildingName.textContent = destinationName;
    bearingElement.textContent = `${br.toFixed(2)}°`;
    distanceElement.textContent = `${dist.toFixed(2)}m`;
    directionGuide.style.display = 'block';

    // Position the triangle indicator at the edge pointing towards the building
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const maxDistance = Math.min(centerX, centerY) * 0.8; // Increased distance for better visibility

    // Calculate position based on relative bearing - FIXED: Proper positioning
    const angleRad = toRad(rel);
    const x = centerX + Math.sin(angleRad) * maxDistance;
    const y = centerY - Math.cos(angleRad) * maxDistance;

    // Position and rotate the triangle - FIXED: Proper rotation and positioning
    directionIndicator.style.left = `${x}px`;
    directionIndicator.style.top = `${y}px`;

    // Set CSS custom property for rotation and apply animation
    directionIndicator.style.setProperty('--arrow-rotation', `${rel}deg`);
    directionIndicator.style.animation = `floatArrow 2s infinite ease-in-out`;
    directionIndicator.style.display = 'block';

    // Update compass needle to show absolute bearing with smooth transition
    compassNeedle.style.transform = `translate(-50%, -100%) rotate(${br}deg)`;
    compassDegree.textContent = `${br.toFixed(1)}°`;

    // Update enhanced compass
    enhancedCompassNeedle.style.transform = `translate(-50%, -100%) rotate(${br}deg)`;
    enhancedCompassDegree.textContent = `${br.toFixed(1)}°`;

    // Update navigation info with turn direction and FLOAT values
    let turnDirection = "";
    let turnAngle = Math.abs(rel);

    if (turnAngle < 5) {
        turnDirection = "Straight ahead";
    } else if (rel > 0) {
        turnDirection = `Turn right ${turnAngle.toFixed(1)}°`;
    } else {
        turnDirection = `Turn left ${turnAngle.toFixed(1)}°`;
    }

    navText.replaceChildren();
    const destinationLabel = document.createElement('strong');
    destinationLabel.textContent = destinationName;
    navText.append(
        destinationLabel,
        document.createElement('br'),
        document.createTextNode(`${activeRouteCoordinates ? turnDirection : 'Direct bearing · route unavailable'} · ${dist.toFixed(2)} m`)
    );

    // Update info box with detailed information and FLOAT values
    infoBox.textContent = `${destinationName} — ${dist.toFixed(2)} m · Bearing: ${br.toFixed(2)}°${deviceHeadingAvailable ? ` · Turn: ${rel.toFixed(2)}°` : ' · Compass unavailable'}`;
}

// Start app
startBtn.onclick = () => {
    splash.style.animation = 'fadeOut 1s ease forwards';

    setTimeout(() => {
        splash.style.display = 'none';
        appDiv.style.display = 'block';
        initMap();
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) {
            map.setView([28.2550, 83.9765], 18);
        } else {
            map.setView([15, 0], 2);
            startupFlyInActive = true;
            map.flyTo([28.2550, 83.9765], 18, { duration: 3.6, easeLinearity: 0.22 });
            map.once('moveend', () => {
                startupFlyInActive = false;
                if (userPos) {
                    map.flyTo([userPos.lat, userPos.lon], 17, { duration: 1.4 });
                }
            });
        }
        
        // Show location request button only if location permission wasn't granted
        if (!userPos) {
            locationRequestBtn.style.display = 'flex';
        }
        
        // Only start location tracking if permission was granted
        if (locationPermissionGranted) {
            startLocationWatch();
        } else {
            infoBox.textContent = 'Location tracking disabled. Enable in settings to use navigation features.';
            locationStatusText.textContent = 'Location off';
        }
        
        // Only request orientation if permission was granted
        if (orientationPermissionGranted) {
            requestOrientationPermission();
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        loadFixedBuildings();
        showMapMode();
        init3DModelViewer(); // Initialize 3D model viewer
        
        // NEW: Initialize route type selection
        initRouteTypeSelection();
        
        // NEW: Initialize measurement event listeners
        initMeasurementEventListeners();
        initSurveyTools();
        
    }, 1000);
};

// NEW: Initialize measurement event listeners
function initMeasurementEventListeners() {
    // Tool selection
    measureToolButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tool = this.getAttribute('data-tool');
            changeMeasurementTool(tool);
        });
    });

    // Color selection
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            changeMeasurementColor(color);
        });
    });

    // Symbol selection
    symbolOptions.forEach(option => {
        option.addEventListener('click', function() {
            const symbol = this.getAttribute('data-symbol');
            changeMeasurementSymbol(symbol);
        });
    });

    // Stroke width slider
    measureStrokeSlider.addEventListener('input', function() {
        currentStrokeWidth = parseInt(this.value);
        updateMeasurementControls();
        
        // Redraw with new stroke width
        if (measurementPoints.length > 0) {
            const currentState = {
                points: [...measurementPoints],
                layers: [...measurementLayers]
            };
            clearMeasurementLayers();
            measurementPoints = currentState.points;
            restoreFromHistory();
        }
    });

    // Opacity slider
    measureOpacitySlider.addEventListener('input', function() {
        currentOpacity = parseInt(this.value) / 100;
        updateMeasurementControls();
        
        // Redraw with new opacity
        if (measurementPoints.length > 0 && currentToolType === 'area') {
            const currentState = {
                points: [...measurementPoints],
                layers: [...measurementLayers]
            };
            clearMeasurementLayers();
            measurementPoints = currentState.points;
            restoreFromHistory();
        }
    });

    // Undo/Redo/Clear buttons
    undoBtn.addEventListener('click', undoMeasurement);
    redoBtn.addEventListener('click', redoMeasurement);
    clearBtn.addEventListener('click', clearMeasurements);
    exportBtn.addEventListener('click', exportMeasurements);
}

// NEW: Initialize route type selection
function initRouteTypeSelection() {
    routeTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            changeRouteType(type);
        });
    });
}

// Initialize 3D Model Viewer - FIXED: Proper initialization with WRC model
function init3DModelViewer() {
    // Model switching functionality
    modelSelectorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modelType = this.getAttribute('data-model');
            
            // Update active button
            modelSelectorButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide models
            if (modelType === 'seoul') {
                seoulModel.style.display = 'block';
                free3dModel.style.display = 'none';
                if (wrcModel) wrcModel.style.display = 'none';
                
                // Update model info
                modelInfoText.innerHTML = `
                    <a href="https://sketchfab.com/3d-models/seoul-city-gameready-render-blender-pbr-437c621c016c4f15a68b106ba2c4db87?utm_medium=embed&utm_campaign=share-popup&utm_content=437c621c016c4f15a68b106ba2c4db87" target="_blank" rel="nofollow">
                        Seoul City | Gameready | Render | Blender | PBR
                    </a> by 
                    <a href="https://sketchfab.com/abhayexe?utm_medium=embed&utm_campaign=share-popup&utm_content=437c621c016c4f15a68b106ba2c4db87" target="_blank" rel="nofollow">
                        abhayexe
                    </a> on 
                    <a href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=437c621c016c4f15a68b106ba2c4db87" target="_blank" rel="nofollow">
                        Sketchfab
                    </a>
                `;
                
                // Update model details
                modelDetails.innerHTML = `
                    <li>
                        <span class="value">Title: Seoul City</span>
                    </li>
                    <li>
                        <span class="value">Type: Game-ready 3D Model</span>
                    </li>
                    <li>
                        <span class="value">Software: Blender</span>
                    </li>
                    <li>
                        <span class="value">Rendering: PBR Materials</span>
                    </li>
                    <li>
                        <span class="value">Creator: abhayexe</span>
                    </li>
                    <li>
                        <span class="value">Platform: Sketchfab</span>
                    </li>
                `;
            } else if (modelType === 'free3d') {
                seoulModel.style.display = 'none';
                free3dModel.style.display = 'block';
                if (wrcModel) wrcModel.style.display = 'none';
                
                // Update model info
                modelInfoText.innerHTML = `
                    <a href="https://sketchfab.com/3d-models/free3dmodel-c9fbac0b50ee420e9b536b9d0c94f909?utm_medium=embed&utm_campaign=share-popup&utm_content=c9fbac0b50ee420e9b536b9d0c94f909" target="_blank" rel="nofollow">
                        Free3DModel
                    </a> by 
                    <a href="https://sketchfab.com/thakurnikee47?utm_medium=embed&utm_campaign=share-popup&utm_content=c9fbac0b50ee420e9b536b9d0c94f909" target="_blank" rel="nofollow">
                        thakurnikee47
                    </a> on 
                    <a href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=c9fbac0b50ee420e9b536b9d0c94f909" target="_blank" rel="nofollow">
                        Sketchfab
                    </a>
                `;
                
                // Update model details
                modelDetails.innerHTML = `
                    <li>
                        <span class="value">Title: Free3DModel</span>
                    </li>
                    <li>
                        <span class="value">Type: 3D Model</span>
                    </li>
                    <li>
                        <span class="value">Creator: thakurnikee47</span>
                    </li>
                    <li>
                        <span class="value">Platform: Sketchfab</span>
                    </li>
                `;
            } else if (modelType === 'wrc' && wrcModel) {
                seoulModel.style.display = 'none';
                free3dModel.style.display = 'none';
                wrcModel.style.display = 'block';
                
                // Update model info for WRC
                modelInfoText.innerHTML = `
                    <a href="https://lcc-viewer.xgrids.com/pub/dbdxnc-ric_wrc" target="_blank" rel="nofollow">
                        Western Regional Campus 3D Model
                    </a> on 
                    <a href="https://xgrids.com" target="_blank" rel="nofollow">
                        XGrids Viewer</a>
                `;
                
                // Update model details for WRC
                modelDetails.innerHTML = `
                    <li>
                        <span class="value">Title: Western Regional Campus</span>
                    </li>
                    <li>
                        <span class="value">Total Number of Floors:- 15</span>
                    </li>
                    <li>
                        <span class="value">Viewer: XGrids LCC Viewer</span>
                    </li>
                    <li>
                        <span class="value">Opening Time:- 6:00 AM - 4:00 PM</span>
                    </li>
                    <li>
                        <span class="value">Format: WebGL Interactive</span>
                    </li>
                    <li>
                        <span class="value">Platform: XGrids</span>
                    </li>
                `;
            }
        });
    });

    

    // Reset view button functionality
    resetViewBtn.addEventListener('click', function() {
        // Reload the current model
        const activeModel = document.querySelector('.model-selector-btn.active').getAttribute('data-model');
        if (activeModel === 'seoul') {
            seoulModel.src = seoulModel.src;
        } else if (activeModel === 'free3d') {
            free3dModel.src = free3dModel.src;
        } else if (activeModel === 'wrc' && wrcModel) {
            wrcModel.src = wrcModel.src;
        }
    });

    // Fullscreen button functionality
    fullscreenBtn.addEventListener('click', function() {
        const modelWrapper = document.querySelector('.model-viewer-wrapper');
        if (modelWrapper.requestFullscreen) {
            modelWrapper.requestFullscreen();
        } else if (modelWrapper.mozRequestFullScreen) {
            modelWrapper.mozRequestFullScreen();
        } else if (modelWrapper.webkitRequestFullscreen) {
            modelWrapper.webkitRequestFullscreen();
        } else if (modelWrapper.msRequestFullscreen) {
            modelWrapper.msRequestFullscreen();
        }
    });

    // Close model viewer
    closeModelViewer.addEventListener('click', function() {
        showMapMode();
    });
}

// Show 3D Model Viewer
function showModelViewer() {
    closeMapTypeMenu();
    stopCamera();
    stopSimulatedCamera();
    cameraView.style.display = 'none';
    document.getElementById('map').style.display = 'none';
    measureControls.style.display = 'none';
    osmControls.style.display = 'none';
    osmBuildingsView.style.display = 'none';
    document.getElementById('panel').style.display = 'none';
    mapTypeControls.style.display = 'none';
    enhancedCompass.style.display = 'none';
    oldCompass.style.display = 'none';
    modelViewer.style.display = 'flex';
    setActiveMode('modelBtn');
    deviceCompass.style.display = 'none';
}

// Initialize OSM Buildings map - FIXED VERSION
function initOSMBuildings() {
    if (osmMap) return;

    try {
        osmMap = new OSMBuildings({
            container: 'osmBuildingsView',
            position: { latitude: 28.2550, longitude: 83.9765 },
            zoom: currentZoom,
            minZoom: 15,
            maxZoom: 20,
            tilt: currentTilt,
            rotation: currentRotation,
            attribution: '© Data <a href="https://openstreetmap.org/copyright/">OpenStreetMap</a> © Map <a href="https://osmbuildings.org/copyright/">OSM Buildings</a>'
        });

        // Add map tiles and building data
        osmMap.addMapTiles('https://tile-a.openstreetmap.fr/hot/{z}/{x}/{y}.png');
        osmMap.addGeoJSONTiles('https://{s}.data.osmbuildings.org/0.2/59fcc2e8/tile/{z}/{x}/{y}.json');

        // Setup OSM Buildings event listeners
        setupOSMBuildingsEventListeners();
        updateOSMControls();

        console.log("OSM Buildings initialized successfully");
    } catch (error) {
        console.error('Error initializing OSM Buildings:', error);
        infoBox.textContent = 'Error loading OSM Buildings 3D view';
    }
}

// Setup OSM Buildings event listeners - FIXED VERSION
function setupOSMBuildingsEventListeners() {
    // Event listeners for sliders
    osmTiltSlider.addEventListener('input', function() {
        currentTilt = parseInt(this.value);
        if (osmMap) {
            osmMap.setTilt(currentTilt);
        }
        updateOSMControls();
    });

    osmRotationSlider.addEventListener('input', function() {
        currentRotation = parseInt(this.value);
        if (osmMap) {
            osmMap.setRotation(currentRotation);
        }
        updateOSMControls();
    });

    osmZoomSlider.addEventListener('input', function() {
        currentZoom = parseInt(this.value);
        if (osmMap) {
            osmMap.setZoom(currentZoom);
        }
        updateOSMControls();
    });

    // Tilt buttons
    osmTiltUp.addEventListener('click', function() {
        currentTilt = Math.min(80, currentTilt + 5);
        if (osmMap) {
            osmMap.setTilt(currentTilt);
        }
        updateOSMControls();
    });

    osmTiltDown.addEventListener('click', function() {
        currentTilt = Math.max(0, currentTilt - 5);
        if (osmMap) {
            osmMap.setTilt(currentTilt);
        }
        updateOSMControls();
    });

    // Rotation buttons
    osmRotateLeft.addEventListener('click', function() {
        currentRotation = (currentRotation - 15) % 360;
        if (osmMap) {
            osmMap.setRotation(currentRotation);
        }
        updateOSMControls();
    });

    osmRotateRight.addEventListener('click', function() {
        currentRotation = (currentRotation + 15) % 360;
        if (osmMap) {
            osmMap.setRotation(currentRotation);
        }
        updateOSMControls();
    });

    // Toggle rotation
    osmToggleRotation.addEventListener('click', function() {
        isRotating = !isRotating;
        this.classList.toggle('active', isRotating);
        this.textContent = isRotating ? 'Stop Rotation' : 'Auto Rotate';

        if (isRotating) {
            lastRenderTime = 0;
            rotationAnimationId = requestAnimationFrame(rotateOSMMap);
        } else {
            cancelAnimationFrame(rotationAnimationId);
        }
    });

    // Zoom buttons
    osmZoomIn.addEventListener('click', function() {
        currentZoom = Math.min(20, currentZoom + 1);
        if (osmMap) {
            osmMap.setZoom(currentZoom);
        }
        updateOSMControls();
    });

    osmZoomOut.addEventListener('click', function() {
        currentZoom = Math.max(15, currentZoom - 1);
        if (osmMap) {
            osmMap.setZoom(currentZoom);
        }
        updateOSMControls();
    });

    // Current location button
    osmCurrentLocationBtn.addEventListener('click', goToOSMCurrentLocation);

    // Reset button
    osmResetView.addEventListener('click', goToOSMCurrentLocation);

    // Location buttons
    document.querySelectorAll('.osm-location-btn:not(#osmCurrentLocationBtn)').forEach(button => {
        button.addEventListener('click', function() {
            const lat = parseFloat(this.getAttribute('data-lat'));
            const lon = parseFloat(this.getAttribute('data-lon'));
            changeOSMLocation(lat, lon);
        });
    });

    // Search functionality
    osmSearchButton.addEventListener('click', () => {
        if (osmSearchDebounceTimer) {
            clearTimeout(osmSearchDebounceTimer);
            osmSearchDebounceTimer = null;
        }
        const query = osmSearchInput.value.trim();
        if (query) {
            searchLocation(query);
        }
    });

    osmSearchInput.addEventListener('input', () => {
        const query = osmSearchInput.value.trim();
        if (osmSearchDebounceTimer) {
            clearTimeout(osmSearchDebounceTimer);
        }
        if (osmSearchController) {
            osmSearchController.abort();
        }
        if (query.length >= 3) {
            osmSearchResults.style.display = 'none';
            osmSearchDebounceTimer = setTimeout(() => searchLocation(query), 900);
        } else {
            osmSearchResults.style.display = 'none';
        }
    });

    osmSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (osmSearchDebounceTimer) {
                clearTimeout(osmSearchDebounceTimer);
                osmSearchDebounceTimer = null;
            }
            const query = osmSearchInput.value.trim();
            if (query) {
                searchLocation(query);
            }
        }
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!osmControls.contains(e.target)) {
            osmSearchResults.style.display = 'none';
        }
    });
}

// Update OSM Buildings controls
function updateOSMControls() {
    osmTiltValue.textContent = currentTilt + '°';
    osmRotationValue.textContent = currentRotation + '°';
    osmZoomValue.textContent = currentZoom;

    osmTiltSlider.value = currentTilt;
    osmRotationSlider.value = currentRotation;
    osmZoomSlider.value = currentZoom;
}

// Go to user's current location in OSM Buildings
function goToOSMCurrentLocation() {
    if (userPos && osmMap) {
        osmMap.setPosition({ latitude: userPos.lat, longitude: userPos.lon });

        // Reset view settings
        currentTilt = 0;
        currentRotation = 0;
        currentZoom = 16;
        if (osmMap) {
            osmMap.setTilt(currentTilt);
            osmMap.setRotation(currentRotation);
            osmMap.setZoom(currentZoom);
        }
        updateOSMControls();

        // Stop rotation if active
        if (isRotating) {
            isRotating = false;
            osmToggleRotation.classList.remove('active');
            osmToggleRotation.textContent = 'Auto Rotate';
            cancelAnimationFrame(rotationAnimationId);
        }
    }
}

// Change OSM Buildings location
function changeOSMLocation(lat, lon) {
    if (osmMap) {
        osmMap.setPosition({ latitude: lat, longitude: lon });
    }
}

// Optimized rotation animation for OSM Buildings
function rotateOSMMap(timestamp) {
    if (!isRotating || !osmMap) return;

    // Frame rate control
    if (timestamp - lastRenderTime < frameInterval) {
        rotationAnimationId = requestAnimationFrame(rotateOSMMap);
        return;
    }

    lastRenderTime = timestamp;

    // Adjust rotation speed
    let rotationSpeed = 0.5; // Smooth rotation

    currentRotation = (currentRotation + rotationSpeed) % 360;
    osmMap.setRotation(currentRotation);
    updateOSMControls();

    rotationAnimationId = requestAnimationFrame(rotateOSMMap);
}

// Show arrival notification
function showArrivalNotification(buildingName) {
    const existingNotification = document.querySelector('.arrival-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'arrival-notification';
    notification.innerHTML = `
        <h3>🎉 Congratulations!</h3>
        <p>You have arrived at <strong>${buildingName}</strong></p>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Update mini map with route and position
function updateMiniMap() {
    if (!miniMap || !userPos) return;

    if (currentDestination && routeToBuilding) {
        const bounds = activeRouteCoordinates
            ? L.latLngBounds(activeRouteCoordinates.map(coordinate => [coordinate[1], coordinate[0]]))
            : L.latLngBounds([userPos.lat, userPos.lon], [routeToBuilding.lat, routeToBuilding.lon]);
        miniMap.fitBounds(bounds, { padding: [10, 10] });
    } else {
        miniMap.setView([userPos.lat, userPos.lon], 17);
    }

    if (miniUserMarker) {
        miniUserMarker.setLatLng([userPos.lat, userPos.lon]);
    }

    if (currentDestination && routeToBuilding) {
        updateMiniMapRoute();
    }

    if (selectedBuildingId && routeToBuilding) {
        const b = buildingLayers.find(x => String(x.id) === String(selectedBuildingId));
        if (b) {
            const centroid = computeCentroid(b.coords);
            const dist = haversine(userPos.lat, userPos.lon, centroid.lat, centroid.lon);
            const br = bearing(userPos.lat, userPos.lon, centroid.lat, centroid.lon);
            const rel = ((br - deviceHeading + 540) % 360) - 180;

            if (dist <= ARRIVAL_DISTANCE && !arrivalShown) {
                showArrivalNotification(b.name);
                arrivalShown = true;
                navText.innerHTML = `<strong>${b.name}</strong><br>🎉 You have arrived!`;
                directionIndicator.style.display = 'none';
                directionGuide.style.display = 'none';
            } else if (dist > ARRIVAL_DISTANCE) {
                arrivalShown = false;
            }

            if (totalDistance > 0) {
                const remaining = Math.max(0, totalDistance - dist);
                const progress = Math.max(0, 100 - (remaining / totalDistance * 100));
                distanceProgress.style.width = `${progress}%`;
            }
        }
    }
}

// Update route line on mini map
function updateMiniMapRoute() {
    if (!miniMap || !userPos || !routeToBuilding) return;

    if (miniRouteLine) {
        miniMap.removeLayer(miniRouteLine);
        miniRouteLine = null;
    }

    if (activeRouteCoordinates) {
        miniRouteLine = L.polyline(activeRouteCoordinates.map(coordinate => [coordinate[1], coordinate[0]]), {
        color: ROUTE_TYPES[currentRouteType].color,
        weight: 4,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round'
    }).addTo(miniMap);
    }

    if (!miniDestinationMarker) {
        miniDestinationMarker = L.marker([routeToBuilding.lat, routeToBuilding.lon], {
            icon: L.divIcon({
                className: 'destination-marker',
                html: '<div style="background:#ff6b6b;width:10px;height:10px;border-radius:50%;border:2px solid white;box-shadow:0 0 5px rgba(0,0,0,0.5)"></div>',
                iconSize: [14, 14],
                iconAnchor: [7, 7]
            })
        }).addTo(miniMap);
    } else {
        miniDestinationMarker.setLatLng([routeToBuilding.lat, routeToBuilding.lon]);
    }
}

// Initialize mini map for AR view
function initMiniMap() {
    if (miniMap) return;

    miniMap = L.map('miniMap', {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false
    }).setView([28.2550,83.9765], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(miniMap);

    if (userPos) {
        miniUserMarker = L.marker([userPos.lat, userPos.lon], {
            icon: L.divIcon({
                className: 'mini-user-marker',
                html: '<div style="background:#1e90ff;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 0 5px rgba(0,0,0,0.5)"></div>',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            })
        }).addTo(miniMap);
    }
}

// Load fixed campus dataset
function loadFixedBuildings(){
    usingFixed = true;
    clearBuildings();
    FIXED_BUILDINGS.forEach((p, index) => {
        const color = BUILDING_COLORS[index % BUILDING_COLORS.length];

        const marker = L.marker([p.lat,p.lon]).addTo(map).bindPopup(`
            <strong>${p.name}</strong><br>
            ${p.description || ''}<br>
            <button onclick="viewBuildingModel('${p.id}')" style="margin-top:5px;padding:5px;background:#3182ce;color:white;border:none;border-radius:4px;cursor:pointer">
                View 3D Model
            </button>
        `);
        const size = 0.00005;
        const coords = [
            [p.lat - size, p.lon - size],
            [p.lat - size, p.lon + size],
            [p.lat + size, p.lon + size],
            [p.lat + size, p.lon - size]
        ];
        const poly = L.polygon(coords, { color, weight:1, fillOpacity:0.25 }).addTo(map);
        buildingLayers.push({
            id: p.id,
            name: p.name,
            coords: coords,
            layer: poly,
            marker,
            color,
            modelUrl: p.modelUrl,
            description: p.description
        });
    });
    populateBuildingSelect();
    infoBox.textContent = 'Loaded fixed campus buildings.';
}

// View building 3D model
function viewBuildingModel(buildingId) {
    const building = buildingLayers.find(b => b.id === buildingId);
    if (building) {
        // For now, we'll just show the Seoul City model
        showModelViewer();
    } else {
        alert('Building not found');
    }
}

// Fetch buildings from OSM via Overpass
async function loadOSMBuildings(){
    if(!userPos){ alert('Waiting for GPS first'); return; }
    usingFixed = false;
    await fetchAndRenderBuildings(userPos.lat, userPos.lon);
}

// Clear building layers
function clearBuildings(){
    buildingLayers.forEach(b => {
        try{
            map.removeLayer(b.layer);
            if(b.marker) map.removeLayer(b.marker);
        }catch(e){}
    });
    buildingLayers = [];
    if(routingControl){ map.removeControl(routingControl); routingControl = null; }
    stopCamera();
    clearBuildingDots();
    directionIndicator.style.display = 'none';
    directionGuide.style.display = 'none';
}

// Clear building dots from AR view
function clearBuildingDots() {
    buildingDots.forEach(dot => {
        if (dot && dot.parentNode) {
            dot.parentNode.removeChild(dot);
        }
    });
    buildingDots = [];
}

// Populate select list
function populateBuildingSelect(){
    buildingSelect.innerHTML = '<option value="">— Choose building —</option>';
    buildingLayers.forEach(b => {
        const opt = document.createElement('option'); opt.value = b.id; opt.text = b.name;
        buildingSelect.appendChild(opt);
    });
}

// Overpass fetch function
async function fetchAndRenderBuildings(lat, lon){
    try{
        infoBox.textContent = 'Loading nearby OSM buildings...';
        const q = `[out:json][timeout:25];(way["building"](around:${BUILDING_FETCH_RADIUS},${lat},${lon});relation["building"](around:${BUILDING_FETCH_RADIUS},${lat},${lon}););out body;>;out skel qt;`;
        const res = await fetch(OVERPASS_URL, { method:'POST', body: q });
        if(!res.ok) throw new Error('Overpass error ' + res.status);
        const json = await res.json();
        const nodes = {};
        json.elements.filter(e => e.type === 'node').forEach(n => nodes[n.id] = {lat:n.lat, lon:n.lon});
        const ways = json.elements.filter(e => e.type === 'way' && e.tags && e.tags.building && e.nodes && e.nodes.length>2);
        clearBuildings();
        if(ways.length === 0){
            infoBox.textContent = 'No OSM building footprints found nearby; keep fixed list or refresh.';
            return;
        }
        ways.forEach((w, index) => {
            const coords = w.nodes.map(id => nodes[id]).filter(Boolean).map(n => [n.lat, n.lon]);
            if(coords.length < 3) return;
            const name = (w.tags && (w.tags.name || w.tags.building)) || 'Building';
            const color = BUILDING_COLORS[index % BUILDING_COLORS.length];
            const poly = L.polygon(coords, { color, weight:1, fillOpacity:0.25 }).addTo(map).bindPopup(name);
            buildingLayers.push({ id: w.id, name, coords, layer: poly, color });
        });
        populateBuildingSelect();
        infoBox.textContent = `Loaded ${buildingLayers.length} OSM buildings.`;
    }catch(err){
        console.error(err);
        infoBox.textContent = 'Failed to load OSM buildings — fallback to fixed list.';
        loadFixedBuildings();
    }
}

function routeCacheKey(origin, destination, mode) {
    return `v2_${origin.lat.toFixed(6)},${origin.lon.toFixed(6)}_${destination.lat.toFixed(6)},${destination.lon.toFixed(6)}_${mode}`;
}

function displayRoute(route, destination, cached) {
    if (routingControl) {
        map.removeControl(routingControl);
    }

    const routeConfig = ROUTE_TYPES[currentRouteType];
    const latLngs = route.coordinates.map(coordinate => [coordinate[1], coordinate[0]]);
    routingControl = L.polyline(latLngs, {
        color: routeConfig.color,
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
    }).addTo(map);
    activeRouteCoordinates = route.coordinates;
    if (document.getElementById('map').style.display !== 'none') {
        map.fitBounds(routingControl.getBounds(), {
            paddingTopLeft: [24, 88],
            paddingBottomRight: [24, 96],
            maxZoom: 19
        });
    }

    const distance = route.distance >= 1000
        ? `${(route.distance / 1000).toFixed(2)} km`
        : `${Math.round(route.distance)} m`;
    const duration = `${Math.max(1, Math.round(route.duration / 60))} min`;
    routeDetails.hidden = false;
    routeSummaryTitle.textContent = `${routeConfig.name} route${cached ? ' · saved' : ''}`;
    routeSummaryMetrics.textContent = `${distance} · ${duration}`;
    routeSteps.replaceChildren();

    route.steps.filter(step => step && step.maneuver).slice(0, 12).forEach(step => {
        const item = document.createElement('li');
        const action = step.maneuver.type === 'depart'
            ? 'Start'
            : step.maneuver.type === 'arrive'
                ? 'Arrive'
                : `${step.maneuver.type.replaceAll('_', ' ')}${step.maneuver.modifier ? ` ${step.maneuver.modifier}` : ''}`;
        const roadName = step.name || (currentRouteType === 'foot' ? 'Unnamed path' : 'Unnamed road');
        item.textContent = `${action} · ${roadName} · ${step.distance >= 1000 ? `${(step.distance / 1000).toFixed(1)} km` : `${Math.round(step.distance)} m`}`;
        routeSteps.appendChild(item);
    });

    routeToBuilding = destination;
    totalDistance = route.distance;
    arrivalShown = false;
    isUsingCachedRoute = cached;
    infoBox.textContent = `${routeConfig.name} route: ${distance}, about ${duration}${cached ? ' (saved route)' : ''}`;
    showRouteStatus(`${routeConfig.name} route ready · ${distance} · ${duration}`, 'success');

    if (cameraView.style.display !== 'none') {
        updateMiniMap();
        updateDirectionIndicator();
    }
}

async function searchWorldRouteDestination() {
    const query = worldRouteQuery.value.trim();
    if (query.length < 3) {
        worldRouteResults.textContent = 'Enter at least 3 characters.';
        return;
    }

    if (globalSearchController) {
        globalSearchController.abort();
    }
    const controller = new AbortController();
    globalSearchController = controller;
    worldRouteSearchBtn.disabled = true;
    worldRouteResults.textContent = 'Searching OpenStreetMap…';

    try {
        const places = await queryNominatim(query, 5, controller.signal);
        if (controller.signal.aborted) return;

        worldRouteResults.replaceChildren();
        if (places.length === 0) {
            worldRouteResults.textContent = 'No matching places found.';
            return;
        }

        places.forEach(place => {
            const lat = Number(place.lat);
            const lon = Number(place.lon);
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

            const result = document.createElement('button');
            result.type = 'button';
            result.className = 'world-route-result';
            result.setAttribute('role', 'option');
            result.textContent = place.display_name || 'Unnamed place';
            result.addEventListener('click', () => {
                const destination = {
                    name: place.display_name || 'Selected destination',
                    lat,
                    lon
                };
                clearRouting();
                selectedBuildingId = null;
                buildingSelect.value = '';
                buildingLayers.forEach(building => {
                    if (building.layer.setStyle) {
                        building.layer.setStyle({ color: building.color, fillOpacity: 0.25, weight: 1 });
                    }
                });
                currentDestination = destination;
                lastRouteUpdatePos = null;
                if (globalDestinationMarker) {
                    map.removeLayer(globalDestinationMarker);
                }
                const destinationPopup = document.createElement('span');
                destinationPopup.textContent = destination.name;
                globalDestinationMarker = L.marker([lat, lon])
                    .addTo(map)
                    .bindPopup(destinationPopup);
                map.flyTo([lat, lon], Math.max(map.getZoom(), 15), { duration: 0.7 });
                worldRouteResults.replaceChildren();
                worldRouteQuery.value = destination.name;
                navText.textContent = `Destination selected: ${destination.name}`;

                if (userPos) {
                    showRouteTo(lat, lon);
                    lastRouteUpdatePos = { lat: userPos.lat, lon: userPos.lon };
                } else {
                    showRouteStatus('Destination selected. Enable location to calculate a route.', 'info');
                    infoBox.textContent = 'Enable location to calculate a route to the selected destination.';
                }
            });
            worldRouteResults.appendChild(result);
        });
        if (!worldRouteResults.childElementCount) {
            worldRouteResults.textContent = 'No usable coordinates were returned.';
        }
    } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Worldwide route destination search failed:', error);
        worldRouteResults.textContent = error.message || 'Place search failed. Please try again.';
    } finally {
        if (globalSearchController === controller) {
            globalSearchController = null;
            worldRouteSearchBtn.disabled = false;
        }
    }
}

async function showRouteTo(lat, lon) {
    if (!userPos) {
        showRouteStatus('Enable location to calculate a route.', 'error');
        return;
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        showRouteStatus('The destination coordinates are invalid.', 'error');
        return;
    }

    const destination = { lat, lon };
    const origin = { lat: userPos.lat, lon: userPos.lon };
    const routeConfig = ROUTE_TYPES[currentRouteType];
    const cacheKey = routeCacheKey(origin, destination, currentRouteType);
    routeToBuilding = destination;
    arrivalShown = false;

    if (routeFetchController) {
        routeFetchController.abort();
    }
    const controller = new AbortController();
    routeFetchController = controller;
    const requestId = ++routeRequestId;

    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
    activeRouteCoordinates = null;
    if (miniRouteLine && miniMap) {
        miniMap.removeLayer(miniRouteLine);
        miniRouteLine = null;
    }
    routeDetails.hidden = false;
    routeSummaryTitle.textContent = `Finding ${routeConfig.name.toLowerCase()} route…`;
    routeSummaryMetrics.textContent = '';
    routeSteps.replaceChildren();
    showRouteStatus(`Finding a ${routeConfig.name.toLowerCase()} route…`, 'info');

    let cached = routeCache[cacheKey];
    if (!cached || !Array.isArray(cached.coordinates) || !Array.isArray(cached.steps)) {
        cached = Object.values(routeCache).find(candidate =>
            candidate &&
            candidate.mode === currentRouteType &&
            candidate.destination &&
            candidate.destination.lat === destination.lat &&
            candidate.destination.lon === destination.lon &&
            candidate.origin &&
            Array.isArray(candidate.coordinates) &&
            Array.isArray(candidate.steps) &&
            haversine(origin.lat, origin.lon, candidate.origin.lat, candidate.origin.lon) <= 15
        );
    }
    if (cached && Array.isArray(cached.coordinates) && Array.isArray(cached.steps)) {
        routeFetchController = null;
        displayRoute(cached, destination, true);
        return;
    }

    const coordinates = `${origin.lon},${origin.lat}%3B${destination.lon},${destination.lat}`;
    const url = `${routeConfig.serviceUrl}/${routeConfig.profile}/${coordinates}?overview=full&geometries=geojson&steps=true&alternatives=false`;

    try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
            throw new Error(`Routing service returned HTTP ${response.status}.`);
        }
        const data = await response.json();
        const route = data.routes && data.routes[0];
        const leg = route && route.legs && route.legs[0];
        const routeCoordinates = route && route.geometry && route.geometry.coordinates;
        if (data.code !== 'Ok' || !route || !leg || !Array.isArray(routeCoordinates) || routeCoordinates.length < 2) {
            throw new Error(data.message || 'No mapped route was found between these points.');
        }

        const routeData = {
            mode: currentRouteType,
            origin,
            destination,
            coordinates: routeCoordinates,
            distance: route.distance,
            duration: route.duration,
            steps: leg.steps || []
        };
        if (requestId !== routeRequestId) return;

        routeCache[cacheKey] = routeData;
        const cacheKeys = Object.keys(routeCache).filter(key => key.startsWith('v2_'));
        while (cacheKeys.length > 12) {
            delete routeCache[cacheKeys.shift()];
        }
        try {
            localStorage.setItem('routeCache', JSON.stringify(routeCache));
        } catch (storageError) {
            console.warn('Could not save route for offline reuse:', storageError);
        }
        displayRoute(routeData, destination, false);
    } catch (error) {
        if (error.name === 'AbortError' || requestId !== routeRequestId) return;
        console.error('Route calculation failed:', error);
        routeDetails.hidden = false;
        routeSummaryTitle.textContent = 'Route unavailable';
        routeSummaryMetrics.textContent = error.message || 'Check location, network, or local path coverage.';
        routeSteps.replaceChildren();
        showRouteStatus(error.message || 'Unable to calculate a route right now.', 'error');
        infoBox.textContent = 'No mapped route found. Check location, network, or local OpenStreetMap path coverage.';
    } finally {
        if (routeFetchController === controller) {
            routeFetchController = null;
        }
    }
}

// NEW: Clear routing and reset navigation state
function clearRouting() {
    routeRequestId += 1;
    if (routeFetchController) {
        routeFetchController.abort();
        routeFetchController = null;
    }
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
    activeRouteCoordinates = null;
    routeDetails.hidden = true;
    
    // Reset navigation state
    selectedBuildingId = null;
    buildingSelect.value = "";
    lastRouteUpdatePos = null;
    routeToBuilding = null;
    currentDestination = null;
    arrivalShown = false;
    if (globalDestinationMarker) {
        map.removeLayer(globalDestinationMarker);
        globalDestinationMarker = null;
    }
    worldRouteResults.replaceChildren();
    
    // Clear mini map route
    if (miniRouteLine) {
        miniMap.removeLayer(miniRouteLine);
        miniRouteLine = null;
    }
    if (miniDestinationMarker) {
        miniMap.removeLayer(miniDestinationMarker);
        miniDestinationMarker = null;
    }
    
    // Reset UI
    navText.innerHTML = 'Select a destination to begin navigation';
    distanceProgress.style.width = '0%';
    directionIndicator.style.display = 'none';
    directionGuide.style.display = 'none';
    removeDomLabel();
    
    // Restore building styles
    buildingLayers.forEach(b => {
        if(b.layer.setStyle) b.layer.setStyle({ color:b.color, fillOpacity:0.25, weight:1 });
    });
    
    infoBox.textContent = 'Navigation cleared.';
}

// NEW: Show route calculation status
function showRouteStatus(message, type) {
    routeStatus.textContent = message;
    routeStatus.className = 'route-status';
    if (type === 'error') {
        routeStatus.classList.add('error');
    } else if (type === 'success') {
        routeStatus.classList.add('success');
    }
    routeStatus.style.display = cameraView.style.display === 'none' ? 'block' : 'none';

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            routeStatus.style.display = 'none';
        }, 5000);
    }
}

// Start location tracking WITHOUT Kalman filter
function startLocationWatch(){
    if(!navigator.geolocation){ alert('Geolocation not supported'); return; }
    if (watchId !== null) return;
    locationStatusText.textContent = 'Finding location…';

    // Load cached routes
    const cachedRoutes = localStorage.getItem('routeCache');
    if (cachedRoutes) {
        try {
            routeCache = JSON.parse(cachedRoutes);
        } catch (error) {
            console.warn('Saved routes could not be loaded; continuing without route cache:', error);
            routeCache = {};
        }
    }

    watchId = navigator.geolocation.watchPosition(pos => {
        userPos = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        locationPermissionGranted = true;
        locationRequestBtn.style.display = 'none';
        document.getElementById('arLocationBtn').style.display = 'none';
        updateSurveyCoordinateDisplay(userPos);
        locationStatusText.textContent = 'Live location';
        document.querySelector('.location-status').classList.add('live');
        infoBox.textContent = 'Live location updated.';
        
        if(!userMarker) {
            const locationIcon = L.divIcon({
                className: 'user-location-icon',
                html: '<span class="user-location-puck" aria-hidden="true"><span class="user-location-pulse"></span><span class="user-location-heading"></span><span class="user-location-dot"></span></span>',
                iconSize: [38, 38],
                iconAnchor: [19, 19]
            });
            userMarker = L.marker([userPos.lat, userPos.lon], { icon: locationIcon })
                .addTo(map)
                .bindPopup('You are here');
        } else {
            userMarker.setLatLng([userPos.lat, userPos.lon]);
        }
        const userMarkerElement = userMarker.getElement();
        userMarkerElement?.classList.toggle('heading-unavailable', !deviceHeadingAvailable);
        if (deviceHeadingAvailable) {
            userMarkerElement?.style.setProperty('--user-heading', `${deviceHeading}deg`);
        }
        
        if(map && !startupFlyInActive && (document.getElementById('map').style.display !== 'none')) {
            map.panTo([userPos.lat, userPos.lon], { animate: true, duration: 0.45 });
        }
        
        if (currentDestination) {
            const selectedBuilding = selectedBuildingId
                ? buildingLayers.find(building => String(building.id) === String(selectedBuildingId))
                : null;
            const destination = selectedBuilding
                ? computeCentroid(selectedBuilding.coords)
                : currentDestination;

            if (Number.isFinite(destination.lat) && Number.isFinite(destination.lon)) {
                const moved = lastRouteUpdatePos
                    ? haversine(userPos.lat, userPos.lon, lastRouteUpdatePos.lat, lastRouteUpdatePos.lon)
                    : Infinity;
                if (moved > 10) {
                    showRouteTo(destination.lat, destination.lon);
                    lastRouteUpdatePos = { lat: userPos.lat, lon: userPos.lon };
                }
            }
        }

        if (cameraView.style.display !== 'none') {
            updateMiniMap();
        }
    }, err => {
        console.warn('Geo error', err);
        locationStatusText.textContent = 'Location unavailable';
        document.querySelector('.location-status').classList.remove('live');
        infoBox.textContent = 'Location error — allow location.';
    }, { 
        enableHighAccuracy: true, 
        maximumAge: 1500, 
        timeout: 10000 
    });
}

// FIXED: Orientation permission & listener with proper updates
function requestOrientationPermission(){
    if (orientationListenerAttached) {
        return Promise.resolve(orientationPermissionGranted);
    }
    if (orientationPermissionRequestPending) {
        return orientationPermissionRequestPromise || Promise.resolve(false);
    }

    let lastUpdate = 0;
    let orientationReceived = false;
    let hasAbsoluteHeading = false;
    let orientationTimeout;
    const UPDATE_INTERVAL = 100;

    function handleOrientation(e){
        const hasMagneticHeading = Number.isFinite(e.webkitCompassHeading);
        const isAbsoluteHeading = e.absolute === true || e.type === 'deviceorientationabsolute' || hasMagneticHeading;
        if (hasAbsoluteHeading && !isAbsoluteHeading) return;

        const now = Date.now();
        if (now - lastUpdate < UPDATE_INTERVAL) return;
        lastUpdate = now;

        if (hasMagneticHeading) {
            deviceHeading = e.webkitCompassHeading;
        } else if (Number.isFinite(e.alpha)) {
            const screenAngle = Number.isFinite(screen.orientation?.angle)
                ? screen.orientation.angle
                : Number.isFinite(window.orientation) ? window.orientation : 0;
            deviceHeading = 360 - e.alpha + screenAngle;
        } else {
            deviceCompassStatus.textContent = 'Heading unavailable';
            return;
        }
        hasAbsoluteHeading = hasAbsoluteHeading || isAbsoluteHeading;
        orientationReceived = true;
        clearTimeout(orientationTimeout);
        deviceHeading = (deviceHeading + 360) % 360;
        deviceHeadingAvailable = true;
        deviceCompassDial.style.transform = `rotate(${-deviceHeading}deg)`;
        deviceCompassDegree.textContent = `${Math.round(deviceHeading)}°`;
        deviceCompassStatus.textContent = hasMagneticHeading
            ? 'Magnetic heading'
            : hasAbsoluteHeading ? 'Absolute sensor' : 'Approximate · calibrate';
        const userMarkerElement = userMarker?.getElement();
        userMarkerElement?.classList.remove('heading-unavailable');
        userMarkerElement?.style.setProperty('--user-heading', `${deviceHeading}deg`);
        orientationListenerAttached = true;

        // Update direction indicator in real-time
        if (cameraView.style.display !== 'none') {
            updateMiniMap();
            updateDirectionIndicator();
        }
    }

    function attachOrientationListeners() {
        window.addEventListener('deviceorientation', handleOrientation, true);
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        orientationListenerAttached = true;
        deviceCompassStatus.textContent = 'Finding heading…';
        orientationTimeout = setTimeout(() => {
            if (orientationReceived) return;
            window.removeEventListener('deviceorientation', handleOrientation, true);
            window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
            orientationListenerAttached = false;
            deviceCompassStatus.textContent = 'No sensor data · tap to retry';
        }, 4000);
    }

    if(typeof DeviceOrientationEvent === 'undefined'){
        deviceCompassStatus.textContent = 'No compass sensor';
        orientationPermissionGranted = false;
        return Promise.resolve(false);
    }

    if(typeof DeviceOrientationEvent.requestPermission === 'function'){
        orientationPermissionRequestPending = true;
        deviceCompassStatus.textContent = 'Requesting compass permission…';
        try {
            orientationPermissionRequestPromise = DeviceOrientationEvent.requestPermission().then(res => {
                if(res === 'granted') {
                    orientationPermissionGranted = true;
                    attachOrientationListeners();
                    return true;
                }
                orientationPermissionGranted = false;
                deviceCompassStatus.textContent = 'Permission denied';
                return false;
            }).catch(err => {
                console.warn('Orientation permission request failed:', err);
                deviceCompassStatus.textContent = 'Orientation unavailable';
                orientationPermissionGranted = false;
                return false;
            }).finally(() => {
                orientationPermissionRequestPending = false;
            });
            return orientationPermissionRequestPromise;
        } catch(err) {
            orientationPermissionRequestPending = false;
            console.warn('Orientation permission request failed:', err);
            deviceCompassStatus.textContent = 'Orientation unavailable';
            orientationPermissionGranted = false;
            return Promise.resolve(false);
        }
    } else {
        orientationPermissionGranted = true;
        attachOrientationListeners();
        return Promise.resolve(true);
    }
}

// NEW: Continue with AR mode after camera permission handling - FIXED FOR HTTPS
async function continueWithARMode() {
    closeMapTypeMenu();
    activateARTool('navigation');
    stopSimulatedCamera();
    document.getElementById('map').style.display = 'none';
    cameraView.style.display = 'block';
    measureControls.style.display = 'none';
    osmControls.style.display = 'none';
    osmBuildingsView.style.display = 'none';
    document.getElementById('panel').style.display = 'block';
    mapTypeControls.style.display = 'none';
    modelViewer.style.display = 'none';
    enhancedCompass.style.display = 'none';
    oldCompass.style.display = 'none';
    deviceCompass.style.display = 'flex';
    setActiveMode('arBtn');
    
    try {
        if (cameraPermissionGranted && window.isSecureContext) {
            try {
                await startARCamera(cameraFacingMode);
                infoBox.textContent = 'AR Mode: Live camera ready. Choose Guide, Cricket, or Camera FX.';
            } catch (streamError) {
                console.warn('Failed to get camera stream:', streamError);
                createSimulatedCameraView();
                infoBox.textContent = 'AR Mode: Camera unavailable. Cricket and compass tools remain available.';
            }
        } else {
            createSimulatedCameraView();
            if (!window.isSecureContext) {
                infoBox.textContent = 'AR Mode: Using simulated view (HTTPS required for camera)';
            } else {
                infoBox.textContent = 'AR Mode: Using simulated view (camera not available)';
            }
        }

        initMiniMap();
        updateMiniMap();
        updateDirectionIndicator();

        scheduleARUpdate();
    } catch(err) {
        console.error('Error in AR mode:', err);
        createSimulatedCameraView();
        infoBox.textContent = 'AR Mode: Using simulated view (camera error)';
        
        initMiniMap();
        updateMiniMap();
        updateDirectionIndicator();
        scheduleARUpdate();
    }
}

async function startARCamera(facingMode) {
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access requires HTTPS and browser camera support.');
    }

    const currentTrack = camStream?.getVideoTracks().find(track => track.readyState === 'live');
    const currentFacingMode = currentTrack?.getSettings().facingMode;
    const activeFacingMode = currentFacingMode || cameraFacingMode;
    let nextStream = camStream;

    if (!currentTrack || activeFacingMode !== facingMode) {
        nextStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: facingMode },
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });
    }

    const previousStream = camStream;
    camVideo.srcObject = nextStream;
    camVideo.classList.toggle('selfie-camera', facingMode === 'user');
    camVideo.style.filter = CAMERA_FILTERS[selectedCameraFilter];

    try {
        await camVideo.play();
    } catch (error) {
        if (nextStream !== previousStream) {
            nextStream.getTracks().forEach(track => track.stop());
            camVideo.srcObject = previousStream;
        }
        throw error;
    }

    if (nextStream !== previousStream) {
        previousStream?.getTracks().forEach(track => track.stop());
    }
    camStream = nextStream;
    cameraFacingMode = facingMode;
    cameraPermissionGranted = true;
    cameraPermissionRequested = true;

    const permissions = JSON.parse(localStorage.getItem('arCampusPermissions') || '{}');
    permissions.camera = true;
    localStorage.setItem('arCampusPermissions', JSON.stringify(permissions));
    stopSimulatedCamera();
}

// NEW: Create simulated camera view when camera is not available - FIXED TO REMOVE THE MESSAGE
function createSimulatedCameraView() {
    stopSimulatedCamera();
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '2';
    canvas.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
    
    const ctx = canvas.getContext('2d');
    
    function drawSimulatedView() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x < canvas.width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        for (let y = 0; y < canvas.height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 20, canvas.height / 2);
        ctx.lineTo(canvas.width / 2 + 20, canvas.height / 2);
        ctx.moveTo(canvas.width / 2, canvas.height / 2 - 20);
        ctx.lineTo(canvas.width / 2, canvas.height / 2 + 20);
        ctx.stroke();
    }
    
    cameraView.appendChild(canvas);
    simulatedCameraCanvas = canvas;
    drawSimulatedView();
}

function stopSimulatedCamera() {
    if (simulatedCameraFrameId !== null) {
        cancelAnimationFrame(simulatedCameraFrameId);
        simulatedCameraFrameId = null;
    }
    if (simulatedCameraCanvas) {
        simulatedCameraCanvas.remove();
        simulatedCameraCanvas = null;
    }
}

function setActiveMode(activeId) {
    const modes = {
        mapBtn: 'map',
        arBtn: 'ar',
        measureBtn: 'measure',
        modelBtn: 'model',
        osmBtn: 'buildings'
    };
    appDiv.dataset.mode = modes[activeId] || 'map';
    document.querySelectorAll('.mode-tab').forEach(button => {
        const isActive = button.id === activeId;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
}

function closeMapTypeMenu() {
    mapTypeWrapper.classList.remove('active');
    mapTypeToggle.setAttribute('aria-expanded', 'false');
}

// Mode switching - FIXED: Properly handles 3D model viewer
function showMapMode(){
    closeMapTypeMenu();
    stopSimulatedCamera();
    if (arAnimationFrameId !== null) {
        cancelAnimationFrame(arAnimationFrameId);
        arAnimationFrameId = null;
    }
    document.getElementById('map').style.display = 'block';
    cameraView.style.display = 'none';
    measureControls.style.display = 'none';
    osmControls.style.display = 'none';
    osmBuildingsView.style.display = 'none';
    document.getElementById('panel').style.display = 'block';
    mapTypeControls.style.display = 'flex';
    modelViewer.style.display = 'none';
    enhancedCompass.style.display = 'none';
    oldCompass.style.display = 'none';
    deviceCompass.style.display = 'flex';
    setActiveMode('mapBtn');
    requestAnimationFrame(() => map.invalidateSize());
    
    // Reset navigation state when exiting to map mode
    selectedBuildingId = null;
    buildingSelect.value = "";
    routeRequestId += 1;
    if (routeFetchController) {
        routeFetchController.abort();
        routeFetchController = null;
    }
    routeDetails.hidden = true;
    if(routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
    activeRouteCoordinates = null;
    if (miniRouteLine && miniMap) {
        miniMap.removeLayer(miniRouteLine);
        miniRouteLine = null;
    }
    if (miniDestinationMarker && miniMap) {
        miniMap.removeLayer(miniDestinationMarker);
        miniDestinationMarker = null;
    }
    lastRouteUpdatePos = null;
    routeToBuilding = null;
    currentDestination = null;
    if (globalDestinationMarker) {
        map.removeLayer(globalDestinationMarker);
        globalDestinationMarker = null;
    }
    
    stopCamera();
    clearBuildingDots();
    directionIndicator.style.display = 'none';
    directionGuide.style.display = 'none';
    stopCamera();
    clearBuildingDots();
    directionIndicator.style.display = 'none';
    directionGuide.style.display = 'none';

    // Stop OSM Buildings rotation
    if (isRotating) {
        isRotating = false;
        osmToggleRotation.classList.remove('active');
        osmToggleRotation.textContent = 'Auto Rotate';
        cancelAnimationFrame(rotationAnimationId);
    }
}

async function showARMode(){
    activateARTool('navigation');
    requestOrientationPermission();
    document.getElementById('arLocationBtn').style.display = userPos ? 'none' : 'flex';
    // Check if camera permission has already been requested
    if (!cameraPermissionRequested) {
        // Show camera permission request
        showCameraPermissionRequest();
        return;
    }
    
    // If camera permission was already requested, continue directly
    continueWithARMode();
}

function showMeasureMode(){
    closeMapTypeMenu();
    stopSimulatedCamera();
    document.getElementById('map').style.display = 'block';
    cameraView.style.display = 'none';
    measureControls.style.display = 'block';
    osmControls.style.display = 'none';
    osmBuildingsView.style.display = 'none';
    document.getElementById('panel').style.display = 'none';
    mapTypeControls.style.display = 'none';
    modelViewer.style.display = 'none';
    enhancedCompass.style.display = 'none';
    oldCompass.style.display = 'none';
    deviceCompass.style.display = 'none';
    setActiveMode('measureBtn');
    requestAnimationFrame(() => map.invalidateSize());
    stopCamera();
    clearBuildingDots();
    directionIndicator.style.display = 'none';
    directionGuide.style.display = 'none';

    // Reset measurement state
    isDrawing = false;
}

function showOSMMode(){
    closeMapTypeMenu();
    stopSimulatedCamera();
    document.getElementById('map').style.display = 'none';
    cameraView.style.display = 'none';
    measureControls.style.display = 'none';
    osmControls.style.display = 'block';
    osmBuildingsView.style.display = 'block';
    document.getElementById('panel').style.display = 'none';
    mapTypeControls.style.display = 'none';
    modelViewer.style.display = 'none';
    enhancedCompass.style.display = 'none';
    oldCompass.style.display = 'none';
    deviceCompass.style.display = 'none';
    setActiveMode('osmBtn');
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    stopCamera();
    clearBuildingDots();
    directionIndicator.style.display = 'none';
    directionGuide.style.display = 'none';

    // Clear search when entering OSM mode
    osmSearchInput.value = '';
    osmSearchResults.style.display = 'none';

    // Initialize OSM Buildings if not already done
    if (!osmMap) {
        initOSMBuildings();
    }

    // Go to current location if available
    if (userPos) {
        goToOSMCurrentLocation();
    }
}

function stopCamera(){
    if(camStream){ camStream.getTracks().forEach(t => t.stop()); camStream = null; camVideo.srcObject = null; }
    stopSimulatedCamera();
}

// populate select when buildings loaded
function populateBuildingSelect(){
    buildingSelect.innerHTML = '<option value="">— Choose building —</option>';
    buildingLayers.forEach(b => {
        const opt = document.createElement('option'); opt.value = b.id; opt.text = b.name;
        buildingSelect.appendChild(opt);
    });
}

// selection - FIXED: Properly updates when selecting different buildings
buildingSelect.addEventListener('change', () => {
    selectedBuildingId = buildingSelect.value || null;
    if (globalDestinationMarker) {
        map.removeLayer(globalDestinationMarker);
        globalDestinationMarker = null;
    }
    buildingLayers.forEach(b => {
        if(String(b.id) === String(selectedBuildingId)){
            if(b.layer.setStyle) b.layer.setStyle({ color:ROUTE_TYPES[currentRouteType].color, fillOpacity:0.45, weight:2 });
            if(b.layer.getBounds) map.fitBounds(b.layer.getBounds(), { maxZoom: 19 });
            const c = computeCentroid(b.coords);
            showRouteTo(c.lat, c.lon);
            currentDestination = b;

            navText.innerHTML = `<strong>${b.name}</strong><br>Navigation started`;

            // FIXED: Update direction indicator immediately when building is selected
            if (cameraView.style.display !== 'none') {
                updateDirectionIndicator();
            }
        } else {
            if(b.layer.setStyle) b.layer.setStyle({ color:b.color, fillOpacity:0.25, weight:1 });
        }
    });

    if (!selectedBuildingId) {
        navText.innerHTML = 'Select a destination to begin navigation';
        distanceProgress.style.width = '0%';
        routeToBuilding = null;
        currentDestination = null;
        routeRequestId += 1;
        if (routeFetchController) {
            routeFetchController.abort();
            routeFetchController = null;
        }
        if (routingControl) {
            map.removeControl(routingControl);
            routingControl = null;
        }
        activeRouteCoordinates = null;
        routeDetails.hidden = true;

        if (miniRouteLine) {
            miniMap.removeLayer(miniRouteLine);
            miniRouteLine = null;
        }
        if (miniDestinationMarker) {
            miniMap.removeLayer(miniDestinationMarker);
            miniDestinationMarker = null;
        }

        directionIndicator.style.display = 'none';
        directionGuide.style.display = 'none';
    }
});

// Resize canvas
function resizeCanvas(){
    const dpr = window.devicePixelRatio || 1;
    arCanvas.width = Math.round(window.innerWidth * dpr);
    arCanvas.height = Math.round(window.innerHeight * dpr);
    arCanvas.style.width = window.innerWidth + 'px';
    arCanvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
}

window.addEventListener('resize', function() {
    resizeCanvas();
});

// DOM label
function ensureDomLabel(){
    if(domLabel) return domLabel;
    const el = document.createElement('div'); el.className='label';
    el.innerHTML = `<div class="box"><div id="lblTitle" style="font-weight:700"></div><div class="meta" id="lblMeta"></div></div>`;
    document.body.appendChild(el);
    domLabel = el;
    return domLabel;
}
function removeDomLabel(){ if(domLabel){ domLabel.remove(); domLabel = null; } }

// Create or update building dots in AR view
function updateBuildingDots() {
    clearBuildingDots();

    if (!userPos || !deviceHeadingAvailable || buildingLayers.length === 0) return;

    buildingLayers.forEach(b => {
        const centroid = computeCentroid(b.coords);
        const dist = haversine(userPos.lat, userPos.lon, centroid.lat, centroid.lon);
        const br = bearing(userPos.lat, userPos.lon, centroid.lat, centroid.lon);
        const rel = ((br - deviceHeading + 540) % 360) - 180;

        if (Math.abs(rel) <= 60) {
            const x = relBearingToX(rel);
            const y = distToY(dist);

            const dot = document.createElement('div');
            dot.className = 'building-dot';
            dot.style.backgroundColor = b.color;
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
            dot.title = `${b.name} (${dist.toFixed(2)}m)`;

            cameraView.appendChild(dot);
            buildingDots.push(dot);
        }
    });
}

// Helper functions for screen mapping
function relBearingToX(rel){
    if(rel>180) rel-=360; if(rel<-180) rel+=360;
    const maxAngle = 60; const r = Math.max(-maxAngle, Math.min(maxAngle, rel));
    const frac = (r + maxAngle)/(2*maxAngle); const pad = 40;
    return pad + frac * (window.innerWidth - pad*2);
}
function distToY(dist){
    const dmin=2, dmax=2000; const d = Math.max(dmin,Math.min(dmax,dist));
    const t = (Math.log(d) - Math.log(dmin)) / (Math.log(dmax) - Math.log(dmin));
    return (0.25 + 0.6 * t) * window.innerHeight;
}

// Helper function to clear form fields
function clearFormFields() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('fullName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

// AR update loop
function updateAR(){
    if (cameraView.style.display === 'none') {
        arAnimationFrameId = null;
        return;
    }

    ctx.clearRect(0,0,arCanvas.width,arCanvas.height);
    if(!userPos){
        infoBox.textContent = 'Waiting for GPS...';
        scheduleARUpdate();
        return;
    }

    updateMiniMap();
    updateDirectionIndicator();
    if (!deviceHeadingAvailable) {
        clearBuildingDots();
        removeDomLabel();
        infoBox.textContent = 'AR direction needs a device compass. Tap the compass to retry sensor access.';
        scheduleARUpdate();
        return;
    }
    updateBuildingDots();

    if(selectedBuildingId){
        const b = buildingLayers.find(x => String(x.id) === String(selectedBuildingId));
        if(b){
            const centroid = computeCentroid(b.coords);
            const dist = haversine(userPos.lat, userPos.lon, centroid.lat, centroid.lon);
            const br = bearing(userPos.lat, userPos.lon, centroid.lat, centroid.lon);
            const rel = ((br - deviceHeading + 540) % 360) - 180;

            const visible = Math.abs(rel) <= VISIBILITY_ANGLE;

            const pts = [];
            for(const v of b.coords){
                const enu = latLonToENU(userPos.lat, userPos.lon, v[0], v[1]);
                const vDist = Math.sqrt(enu.x*enu.x + enu.z*enu.z);
                const vBr = (toDeg(Math.atan2(enu.x, enu.z)) + 360) % 360;
                const vRel = ((vBr - deviceHeading + 540) % 360) - 180;
                if(Math.abs(vRel) > 120){ pts.length = 0; break; }
                const x = relBearingToX(vRel);
                const y = distToY(vDist);
                pts.push({ x, y });
            }
            if(pts.length >= 3 && visible){
                ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
                for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x, pts[i].y);
                ctx.closePath();
                ctx.fillStyle = 'rgba(30,144,255,0.35)'; ctx.fill();
                ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(30,144,255,0.95)'; ctx.stroke();

                const cx = pts.reduce((s,p)=>s+p.x,0)/pts.length;
                const cy = pts.reduce((s,p)=>s+p.y,0)/pts.length - 20;
                const el = ensureDomLabel();
                el.style.left = cx + 'px'; el.style.top = cy + 'px';
                document.getElementById('lblTitle').textContent = b.name;
                document.getElementById('lblMeta').textContent = `${dist.toFixed(2)} m · ${br.toFixed(2)}°`;
                el.style.display = 'block';
            } else {
                removeDomLabel();
            }
        }
    } else {
        removeDomLabel();
    }

    scheduleARUpdate();
}

function scheduleARUpdate() {
    if (arAnimationFrameId === null && cameraView.style.display !== 'none') {
        arAnimationFrameId = requestAnimationFrame(updateAR);
    }
}

function computeCentroid(coords){
    let lat=0, lon=0, n=0;
    coords.forEach(c=>{ lat+=c[0]; lon+=c[1]; n++; });
    return { lat: lat/n, lon: lon/n };
}

// NEW: Location request button handler
function requestCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                locationPermissionGranted = true;
                
                // Save updated permissions
                const permissions = JSON.parse(localStorage.getItem('arCampusPermissions') || '{}');
                permissions.location = true;
                localStorage.setItem('arCampusPermissions', JSON.stringify(permissions));
                
                startLocationWatch();
                locationRequestBtn.style.display = 'none';
                document.getElementById('arLocationBtn').style.display = 'none';
                locationStatusText.textContent = 'Finding location…';
                infoBox.textContent = 'Location permission granted. Tracking your position.';
            },
            function(error) {
                locationStatusText.textContent = 'Location unavailable';
                document.querySelector('.location-status').classList.remove('live');
                infoBox.textContent = 'Location permission denied. Enable in browser settings.';
            }
        );
    } else {
        locationStatusText.textContent = 'Location unsupported';
        infoBox.textContent = 'Geolocation is not supported by this browser.';
    }
}

locationRequestBtn.addEventListener('click', requestCurrentLocation);
document.getElementById('arLocationBtn').addEventListener('click', requestCurrentLocation);

// UI actions
worldRouteSearchBtn.addEventListener('click', searchWorldRouteDestination);
worldRouteQuery.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchWorldRouteDestination();
    }
});
mapBtn.onclick = () => { showMapMode(); };
arBtn.onclick = () => { showARMode(); };
modelBtn.onclick = () => { showModelViewer(); };
measureBtn.onclick = () => { showMeasureMode(); };
osmBtn.onclick = () => { showOSMMode(); };
deviceCompass.onclick = () => { requestOrientationPermission(); };

function activateARTool(tool) {
    document.getElementById('panel').style.display = tool === 'navigation' ? 'block' : 'none';
    const tools = {
        navigation: document.getElementById('arNavigationTab'),
        cricket: document.getElementById('arCricketTab'),
        effects: document.getElementById('arEffectsTab')
    };
    Object.entries(tools).forEach(([name, button]) => {
        const isActive = name === tool;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
    document.getElementById('arCricketPanel').hidden = tool !== 'cricket';
    document.getElementById('arEffectsPanel').hidden = tool !== 'effects';
    if (tool === 'cricket') {
        startCricketScene();
    } else {
        stopCricketScene();
    }
}

function updateCricketScore() {
    document.getElementById('arCricketScore').textContent = `${cricketRuns} / ${cricketWickets}`;
    const completedOvers = Math.floor(cricketDeliveries / 6);
    const ballsInOver = cricketDeliveries % 6;
    document.getElementById('arCricketOvers').textContent = `Over ${completedOvers}.${ballsInOver}`;
    document.getElementById('arCricketBalls').textContent = `${cricketDeliveries}/6 balls`;
    const inningsComplete = cricketDeliveries >= 6 || cricketWickets >= 3;
    document.getElementById('arCricketServe').hidden = inningsComplete;
    document.getElementById('arCricketSwing').hidden = inningsComplete;
    document.getElementById('arCricketReset').hidden = !inningsComplete;
}

function createCricketMesh(geometry, color, options = {}) {
    const material = new THREE.MeshStandardMaterial({
        color,
        roughness: options.roughness ?? 0.78,
        metalness: options.metalness ?? 0,
        transparent: options.opacity !== undefined,
        opacity: options.opacity ?? 1
    });
    const mesh = new THREE.Mesh(geometry, material);
    if (options.castShadow !== false) mesh.castShadow = true;
    if (options.receiveShadow) mesh.receiveShadow = true;
    return mesh;
}

function addCricketBox(parent, color, position, scale, options = {}) {
    const mesh = createCricketMesh(new THREE.BoxGeometry(...scale), color, options);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
}

function createCricketCapsule(radius, length, color) {
    const capsule = new THREE.Group();
    const cylinder = createCricketMesh(
        new THREE.CylinderGeometry(radius, radius, length, 10),
        color
    );
    capsule.add(cylinder);
    for (const y of [-length / 2, length / 2]) {
        const cap = createCricketMesh(new THREE.SphereGeometry(radius, 10, 8), color);
        cap.position.y = y;
        capsule.add(cap);
    }
    return capsule;
}

function addCricketRoleLabel(player, label, accent) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    context.fillStyle = 'rgba(5, 16, 27, 0.92)';
    context.beginPath();
    context.moveTo(42, 10);
    context.lineTo(470, 10);
    context.quadraticCurveTo(502, 10, 502, 42);
    context.lineTo(502, 86);
    context.quadraticCurveTo(502, 118, 470, 118);
    context.lineTo(42, 118);
    context.quadraticCurveTo(10, 118, 10, 86);
    context.lineTo(10, 42);
    context.quadraticCurveTo(10, 10, 42, 10);
    context.fill();
    context.fillStyle = accent;
    context.beginPath();
    context.arc(54, 64, 15, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#ffffff';
    context.font = 'bold 42px system-ui, sans-serif';
    context.textBaseline = 'middle';
    context.fillText(label, 88, 66);

    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    const badge = new THREE.Sprite(new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false
    }));
    badge.position.set(0, 2.52, 0);
    badge.scale.set(1.6, 0.4, 1);
    badge.renderOrder = 10;
    player.add(badge);
    return badge;
}

function addCricketPlayer(scene, position, shirtColor, isBatter = false) {
    const player = new THREE.Group();
    player.position.set(...position);
    if (!isBatter) player.rotation.y = Math.PI;
    scene.add(player);

    const shirt = createCricketCapsule(0.29, 0.48, shirtColor);
    shirt.position.y = 1.15;
    player.add(shirt);

    const trousers = createCricketCapsule(0.13, 0.56, 0xe9edf4);
    trousers.position.set(-0.13, 0.47, 0);
    player.add(trousers);
    const secondTrouserLeg = trousers.clone();
    secondTrouserLeg.position.x = 0.13;
    player.add(secondTrouserLeg);

    const head = createCricketMesh(new THREE.SphereGeometry(0.19, 16, 12), 0xc98756);
    head.position.y = 1.82;
    player.add(head);
    if (isBatter) {
        const helmet = createCricketMesh(new THREE.SphereGeometry(0.215, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.6), 0x16293c, { metalness: 0.18 });
        helmet.position.y = 1.9;
        player.add(helmet);
        addCricketBox(player, 0x16293c, [0, 1.76, 0.13], [0.3, 0.035, 0.04], { castShadow: false });
    } else {
        const cap = createCricketMesh(new THREE.SphereGeometry(0.2, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), 0x155d50);
        cap.position.y = 1.94;
        player.add(cap);
        addCricketBox(player, 0x155d50, [0, 1.89, 0.08], [0.3, 0.035, 0.22], { castShadow: false });
    }

    const armMaterialColor = isBatter ? 0xc98756 : shirtColor;
    const leftArm = createCricketCapsule(0.085, 0.45, armMaterialColor);
    leftArm.position.set(-0.35, 1.14, 0);
    leftArm.rotation.z = -0.4;
    player.add(leftArm);
    const rightArm = leftArm.clone();
    rightArm.position.x = 0.35;
    rightArm.rotation.z = 0.4;
    player.add(rightArm);

    addCricketRoleLabel(player, isBatter ? 'BATTER' : 'BOWLER', isBatter ? '#54b9ff' : '#46e2aa');

    if (!isBatter) {
        const bowlingArm = new THREE.Group();
        bowlingArm.position.set(0.3, 1.36, 0);
        player.add(bowlingArm);
        const arm = createCricketCapsule(0.075, 0.55, 0xc98756);
        arm.position.y = 0.26;
        bowlingArm.add(arm);
        const hand = createCricketMesh(new THREE.SphereGeometry(0.085, 12, 8), 0xc98756);
        hand.position.y = 0.55;
        bowlingArm.add(hand);
        return { player, bowlingArm };
    }

    const batPivot = new THREE.Group();
    batPivot.position.set(0.1, 1.25, 0.08);
    player.add(batPivot);
    const blade = createCricketMesh(new THREE.BoxGeometry(0.17, 0.92, 0.1), 0xe5b669, { roughness: 0.42 });
    blade.position.y = 0.38;
    batPivot.add(blade);
    const batShoulder = createCricketMesh(new THREE.BoxGeometry(0.24, 0.16, 0.11), 0xf1cb82);
    batShoulder.position.set(0, 0.79, 0);
    batPivot.add(batShoulder);
    const grip = createCricketMesh(new THREE.CylinderGeometry(0.043, 0.043, 0.48, 10), 0x293750);
    grip.position.y = 1.09;
    batPivot.add(grip);
    return { player, batPivot };
}

function buildCricketScene() {
    if (!window.THREE) {
        document.getElementById('arCricketStatus').textContent = '3D renderer unavailable · check network access';
        return null;
    }

    const stage = document.getElementById('arCricketStage');
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x102b25, 11, 24);
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
    camera.position.set(0, 5.8, 9.5);
    camera.lookAt(0, 1.05, -0.15);

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('arCricketCanvas'),
            alpha: true,
            antialias: true,
            powerPreference: 'low-power'
        });
    } catch (error) {
        console.warn('3D cricket renderer could not start:', error);
        document.getElementById('arCricketStatus').textContent = '3D graphics unavailable on this device';
        return null;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setSize(stage.clientWidth, stage.clientHeight, false);
    renderer.setClearColor(0x07131a, 0.08);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene.add(new THREE.HemisphereLight(0xe5f6ff, 0x243a21, 2.0));
    const floodlight = new THREE.DirectionalLight(0xffe7bd, 2.5);
    floodlight.position.set(-3.5, 8, 5);
    floodlight.castShadow = true;
    floodlight.shadow.mapSize.set(512, 512);
    floodlight.shadow.camera.left = -8;
    floodlight.shadow.camera.right = 8;
    floodlight.shadow.camera.top = 8;
    floodlight.shadow.camera.bottom = -8;
    scene.add(floodlight);

    addCricketBox(scene, 0x245d43, [0, -0.24, -1.5], [17, 0.22, 18], { receiveShadow: true, castShadow: false });
    const pitch = addCricketBox(scene, 0xcaa977, [0, -0.105, -0.2], [2.0, 0.07, 7.4], { receiveShadow: true });

    const pitchStripes = new THREE.Group();
    for (let index = -3; index <= 3; index += 1) {
        addCricketBox(pitchStripes, 0xe5cb9b, [0, 0, index * 0.92], [1.9, 0.008, 0.015], { castShadow: false, roughness: 1 });
    }
    pitch.add(pitchStripes);

    for (const endZ of [-3.25, 2.82]) {
        addCricketBox(scene, 0xf7f4e9, [-0.42, -0.05, endZ], [0.035, 0.025, 0.68], { castShadow: false });
        addCricketBox(scene, 0xf7f4e9, [0.42, -0.05, endZ], [0.035, 0.025, 0.68], { castShadow: false });
    }

    const stands = new THREE.Group();
    scene.add(stands);
    const seatColors = [0x5386ae, 0xd09462, 0x9d83c2, 0xf1d187, 0x67aa8c];
    for (let row = 0; row < 4; row += 1) {
        addCricketBox(stands, row % 2 ? 0x253b56 : 0x1c314a, [0, 0.18 + row * 0.24, -6.6 - row * 0.05], [11.5 + row * 0.8, 0.24, 0.42], { castShadow: false });
        for (let seat = 0; seat < 32; seat += 1) {
            const x = (seat - 15.5) * 0.36 + (row % 2) * 0.12;
            const spectator = createCricketMesh(new THREE.SphereGeometry(0.075, 6, 5), seatColors[(seat + row * 2) % seatColors.length], { castShadow: false });
            spectator.position.set(x, 0.51 + row * 0.24, -6.55 - row * 0.05);
            stands.add(spectator);
        }
    }
    addCricketBox(scene, 0x1c2e42, [0, 1.45, -7], [4.3, 0.65, 0.35], { castShadow: false });
    addCricketBox(scene, 0xffd66b, [0, 1.58, -6.79], [2.15, 0.07, 0.025], { castShadow: false, metalness: 0.45 });

    const stumpMeshes = [];
    for (const offsetX of [-0.14, 0, 0.14]) {
        const stump = createCricketMesh(new THREE.CylinderGeometry(0.028, 0.028, 0.83, 8), 0xfff7e8, { roughness: 0.38, metalness: 0.12 });
        stump.position.set(offsetX, 0.35, 2.82);
        scene.add(stump);
        stumpMeshes.push(stump);
    }
    addCricketBox(scene, 0xfff7e8, [0, 0.77, 2.82], [0.32, 0.055, 0.065], { castShadow: false });

    const bowler = addCricketPlayer(scene, [-1.05, 0, -3.1], 0x32ad8c);
    const batter = addCricketPlayer(scene, [0.47, 0, 2.08], 0x2e7de0, true);
    const ball = createCricketMesh(new THREE.SphereGeometry(0.14, 18, 14), 0xda3043, { roughness: 0.42, metalness: 0.12 });
    ball.visible = false;
    scene.add(ball);

    const ballSeam = new THREE.Mesh(
        new THREE.TorusGeometry(0.142, 0.008, 5, 20),
        new THREE.MeshStandardMaterial({ color: 0xffd5d0, roughness: 0.55 })
    );
    ballSeam.visible = false;
    scene.add(ballSeam);

    const trailGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    const ballTrail = new THREE.Line(trailGeometry, new THREE.LineBasicMaterial({
        color: 0xff8b91,
        transparent: true,
        opacity: 0.8
    }));
    ballTrail.visible = false;
    scene.add(ballTrail);

    const impactRing = createCricketMesh(
        new THREE.TorusGeometry(0.24, 0.035, 8, 28),
        0xffe28b,
        { opacity: 0.9, castShadow: false, roughness: 0.35, metalness: 0.1 }
    );
    impactRing.rotation.x = Math.PI / 2;
    impactRing.visible = false;
    scene.add(impactRing);

    const shadow = createCricketMesh(
        new THREE.CircleGeometry(0.29, 24),
        0x091313,
        { opacity: 0.45, castShadow: false, roughness: 1 }
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.115;
    shadow.visible = false;
    scene.add(shadow);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    renderer.domElement.addEventListener('pointerdown', event => {
        if (!cricketBallActive) return;
        const bounds = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        if (raycaster.intersectObject(ball).length) swingAtBall();
    });

    const resize = () => {
        const width = Math.max(1, stage.clientWidth);
        const height = Math.max(1, stage.clientHeight);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
    observer?.observe(stage);
    window.addEventListener('resize', resize, { passive: true });
    resize();

    return {
        scene, camera, renderer, observer, resize, ball, ballSeam, ballTrail, impactRing, shadow,
        batter, bowler, stumpMeshes, hitPoint: new THREE.Vector3(), impactStartedAt: 0,
        lastRenderTime: 0
    };
}

function startCricketScene() {
    if (!cricketSceneState) cricketSceneState = buildCricketScene();
    if (!cricketSceneState) return;
    cricketSceneState.resize();
    const { renderer, scene, camera } = cricketSceneState;
    const animate = time => {
        if (document.getElementById('arCricketPanel').hidden || appDiv.dataset.mode !== 'ar') {
            renderer.setAnimationLoop(null);
            return;
        }
        const state = cricketSceneState;
        const frameTime = Number.isFinite(time) ? time : performance.now();
        const delta = Math.min((frameTime - (state.lastRenderTime || frameTime)) / 1000, 0.05);
        state.lastRenderTime = frameTime;
        state.batter.player.position.y = Math.sin(frameTime / 570) * 0.018;
        state.bowler.bowlingArm.rotation.z = Math.sin(frameTime / 440) * 0.12 - 0.25;

        if (cricketBallActive) {
            cricketDeliveryProgress = Math.min((frameTime - cricketDeliveryStartedAt) / 1600, 1);
            const progress = cricketDeliveryProgress;
            const timingLabel = document.getElementById('arCricketTiming');
            const timingText = progress < 0.68 ? 'WATCH THE BALL' : progress < 0.93 ? 'SWING NOW' : 'NOW!';
            if (timingLabel.textContent !== timingText) {
                timingLabel.textContent = timingText;
                timingLabel.classList.toggle('is-timing', progress >= 0.68 && progress < 0.93);
            }
            if (progress <= 0.8) {
                const approach = progress / 0.8;
                state.ball.position.set(
                    -0.82 + approach * 1.37,
                    0.72 + Math.sin(approach * Math.PI / 2) * 0.73,
                    -3.25 + approach * 5.23
                );
            } else {
                const followThrough = (progress - 0.8) / 0.2;
                state.ball.position.set(
                    0.55 - followThrough * 0.45,
                    1.45 - followThrough * 1.02,
                    1.98 + followThrough * 1.12
                );
            }
            state.ball.rotation.x += delta * 7;
            state.ball.rotation.z += delta * 10;
            state.ball.visible = true;
            state.ballSeam.position.copy(state.ball.position);
            state.ballSeam.rotation.set(frameTime / 220, 0.7, frameTime / 260);
            state.ballSeam.visible = true;
            state.shadow.position.x = state.ball.position.x;
            state.shadow.scale.setScalar(1.1 - Math.sin(progress * Math.PI) * 0.42);
            state.shadow.visible = true;
            state.ballTrail.visible = true;
            const trailPositions = state.ballTrail.geometry.attributes.position;
            trailPositions.setXYZ(0, state.ball.position.x, state.ball.position.y, state.ball.position.z);
            trailPositions.setXYZ(1, state.ball.position.x + 0.25, state.ball.position.y + 0.12, state.ball.position.z - 0.62);
            trailPositions.needsUpdate = true;
            state.ballTrail.geometry.computeBoundingSphere();

            if (progress >= 1) resolveCricketDelivery('miss');
        } else {
            const shotElapsed = state.shotStartedAt ? time - state.shotStartedAt : Infinity;
            if (shotElapsed < 1350) {
                const progress = shotElapsed / 1350;
                state.ball.position.set(
                    state.hitPoint.x + Math.sin(progress * Math.PI * 0.42) * (1.4 + state.shotRuns * 0.16),
                    state.hitPoint.y + Math.sin(progress * Math.PI * 0.76) * 2.2,
                    state.hitPoint.z + progress * (5.4 + state.shotRuns * 0.35)
                );
                state.ball.rotation.x += delta * 12;
                state.ball.rotation.z += delta * 16;
                state.ball.visible = true;
                state.ballSeam.position.copy(state.ball.position);
                state.ballSeam.rotation.set(frameTime / 160, 0.9, frameTime / 190);
                state.ballSeam.visible = true;
                state.ballTrail.visible = true;
                const trailPositions = state.ballTrail.geometry.attributes.position;
                trailPositions.setXYZ(0, state.ball.position.x, state.ball.position.y, state.ball.position.z);
                trailPositions.setXYZ(1, state.ball.position.x, state.ball.position.y - 0.2, state.ball.position.z - 0.72);
                trailPositions.needsUpdate = true;
                state.ballTrail.geometry.computeBoundingSphere();
                state.shadow.position.set(state.ball.position.x, -0.115, state.ball.position.z);
                state.shadow.scale.setScalar(Math.max(0.16, 0.52 - progress * 0.3));
                state.shadow.visible = true;
            } else {
                state.ball.visible = false;
                state.ballSeam.visible = false;
                state.ballTrail.visible = false;
                state.shadow.visible = false;
                if (state.shotStartedAt) state.shotStartedAt = 0;
            }
            if (state.batter.swingUntil > frameTime) {
                const swingProgress = 1 - (state.batter.swingUntil - frameTime) / 420;
                state.batter.batPivot.rotation.z = Math.sin(swingProgress * Math.PI) * -2.15;
            } else {
                state.batter.batPivot.rotation.z = THREE.MathUtils.damp(state.batter.batPivot.rotation.z, 0, 8, delta);
            }
            if (state.bowler.releaseUntil > frameTime) {
                const releaseProgress = 1 - (state.bowler.releaseUntil - frameTime) / 540;
                state.bowler.bowlingArm.rotation.x = -0.4 - Math.sin(releaseProgress * Math.PI) * 1.6;
            } else {
                state.bowler.bowlingArm.rotation.x = THREE.MathUtils.damp(state.bowler.bowlingArm.rotation.x, 0, 5, delta);
            }
        }

        if (state.impactStartedAt) {
            const impactProgress = (frameTime - state.impactStartedAt) / 280;
            if (impactProgress < 1) {
                state.impactRing.visible = true;
                state.impactRing.position.copy(state.hitPoint);
                state.impactRing.scale.setScalar(0.7 + impactProgress * 1.8);
                state.impactRing.material.opacity = 0.9 * (1 - impactProgress);
            } else {
                state.impactRing.visible = false;
                state.impactStartedAt = 0;
            }
        }

        state.stumpMeshes.forEach(stump => {
            stump.rotation.x = THREE.MathUtils.damp(stump.rotation.x, state.stumpsFallen ? -0.8 : 0, 8, delta);
        });
        renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);
}

function stopCricketScene() {
    cricketSceneState?.renderer.setAnimationLoop(null);
}

function bowlCricketDelivery() {
    if (cricketBallActive || cricketDeliveries >= 6 || cricketWickets >= 3) return;
    cricketDeliveries += 1;
    cricketDeliveryProgress = 0;
    cricketDeliveryStartedAt = performance.now();
    cricketBallActive = true;
    if (cricketSceneState) {
        cricketSceneState.stumpsFallen = false;
        cricketSceneState.bowler.releaseUntil = cricketDeliveryStartedAt + 540;
        cricketSceneState.batter.swingUntil = 0;
        cricketSceneState.shotStartedAt = 0;
    }
    document.getElementById('arCricketServe').disabled = true;
    document.getElementById('arCricketSwing').disabled = false;
    document.getElementById('arCricketTiming').textContent = 'WATCH THE BALL';
    document.getElementById('arCricketStatus').textContent = `Ball ${cricketDeliveries} · watch the bounce`;
    updateCricketScore();
}

function swingAtBall() {
    if (!cricketBallActive) return;
    const progress = cricketDeliveryProgress;
    const swing = document.getElementById('arCricketSwing');
    swing.disabled = true;
    if (cricketSceneState) cricketSceneState.batter.swingUntil = performance.now() + 420;

    if (progress < 0.72) {
        document.getElementById('arCricketTiming').textContent = 'TOO EARLY';
        document.getElementById('arCricketStatus').textContent = 'Too early · the ball is still coming. Swing again near the batter.';
        swing.disabled = false;
        return;
    }
    if (progress > 0.92) {
        document.getElementById('arCricketTiming').textContent = 'TOO LATE';
        resolveCricketDelivery('miss');
        return;
    }

    const quality = 1 - Math.abs(progress - 0.8) / 0.12;
    const runs = quality > 0.76 ? 6 : quality > 0.5 ? 4 : quality > 0.23 ? 2 : 1;
    resolveCricketDelivery('hit', runs);
}

function resolveCricketDelivery(result, runs = 0) {
    if (!cricketBallActive) return;
    const hitPoint = cricketSceneState?.ball.position.clone();
    cricketBallActive = false;
    document.getElementById('arCricketSwing').disabled = true;
    document.getElementById('arCricketServe').disabled = false;
    document.getElementById('arCricketTiming').classList.remove('is-timing');

    const status = document.getElementById('arCricketStatus');
    const timing = document.getElementById('arCricketTiming');
    if (result === 'hit') {
        cricketRuns += runs;
        timing.textContent = runs === 6 ? 'SIX!' : runs === 4 ? 'FOUR!' : `+${runs} RUN`;
        status.textContent = runs >= 4 ? 'Clean strike · the crowd is on its feet!' : 'Good contact · run between the wickets!';
        if (cricketSceneState) {
            cricketSceneState.hitPoint.copy(hitPoint);
            cricketSceneState.shotStartedAt = performance.now();
            cricketSceneState.shotRuns = runs;
            cricketSceneState.impactStartedAt = performance.now();
            cricketSceneState.batter.swingUntil = performance.now() + 420;
        }
    } else if (Math.random() < 0.65) {
        cricketWickets += 1;
        timing.textContent = 'BOWLED!';
        status.textContent = 'The stumps are hit · pick your next shot.';
        if (cricketSceneState) cricketSceneState.stumpsFallen = true;
    } else {
        timing.textContent = 'DOT BALL';
        status.textContent = 'Missed · no run this ball. Set up for the next.';
    }

    updateCricketScore();
    if (cricketDeliveries >= 6 || cricketWickets >= 3) {
        document.getElementById('arCricketSwing').disabled = true;
        status.textContent = `Innings complete · ${cricketRuns} runs, ${cricketWickets} wickets.`;
    }
}

function resetCricketInnings() {
    cricketRuns = 0;
    cricketDeliveries = 0;
    cricketWickets = 0;
    cricketBallActive = false;
    cricketDeliveryProgress = 0;
    if (cricketSceneState) {
        cricketSceneState.stumpsFallen = false;
        cricketSceneState.shotStartedAt = 0;
        cricketSceneState.batter.swingUntil = 0;
        cricketSceneState.batter.batPivot.rotation.z = 0;
    }
    document.getElementById('arCricketStatus').textContent = 'Ready · bowl the first ball';
    document.getElementById('arCricketTiming').textContent = 'TIMING';
    document.getElementById('arCricketSwing').disabled = true;
    document.getElementById('arCricketServe').disabled = false;
    updateCricketScore();
}

document.getElementById('arNavigationTab').addEventListener('click', () => activateARTool('navigation'));
document.getElementById('arCricketTab').addEventListener('click', () => activateARTool('cricket'));
document.getElementById('arEffectsTab').addEventListener('click', () => activateARTool('effects'));
document.getElementById('arCricketServe').addEventListener('click', bowlCricketDelivery);
document.getElementById('arCricketSwing').addEventListener('click', swingAtBall);
document.getElementById('arCricketReset').addEventListener('click', resetCricketInnings);

document.querySelectorAll('[data-camera-filter]').forEach(button => {
    button.addEventListener('click', () => {
        selectedCameraFilter = button.dataset.cameraFilter;
        camVideo.style.filter = CAMERA_FILTERS[selectedCameraFilter];
        document.querySelectorAll('[data-camera-filter]').forEach(option => {
            const isSelected = option === button;
            option.classList.toggle('active', isSelected);
            option.setAttribute('aria-pressed', String(isSelected));
        });
        infoBox.textContent = `Camera look: ${button.textContent.trim()}.`;
    });
});

document.getElementById('arCameraSwitch').addEventListener('click', async function() {
    const requestedFacingMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
    const label = this.querySelector('span');
    label.textContent = 'Switching camera…';
    this.disabled = true;
    try {
        await startARCamera(requestedFacingMode);
        label.textContent = requestedFacingMode === 'user' ? 'Switch to rear camera' : 'Switch to selfie camera';
        infoBox.textContent = `${requestedFacingMode === 'user' ? 'Selfie' : 'Rear'} camera active.`;
    } catch (error) {
        console.warn('Could not switch the AR camera:', error);
        label.textContent = cameraFacingMode === 'user' ? 'Switch to rear camera' : 'Switch to selfie camera';
        infoBox.textContent = 'Could not switch cameras. Check browser permission and try again.';
    } finally {
        this.disabled = false;
    }
});

document.getElementById('arExperienceBtn').addEventListener('click', async function() {
    requestOrientationPermission();
    const label = document.getElementById('arExperienceLabel');
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        label.textContent = 'Camera requires HTTPS';
        infoBox.textContent = 'Live AR camera requires a secure HTTPS connection. The simulated AR view remains available.';
        return;
    }

    try {
        await startARCamera(cameraFacingMode);
        label.textContent = 'AR experience active';
        infoBox.textContent = 'Live camera AR is active. Choose Guide, Cricket, or Camera FX.';
    } catch (error) {
        console.warn('Could not start the AR camera:', error);
        label.textContent = 'Retry AR camera';
        infoBox.textContent = 'Camera access was not available. Check browser permission and try again.';
    }
});
document.getElementById('panelCollapseBtn').addEventListener('click', function() {
    const isCollapsed = document.getElementById('panel').classList.toggle('collapsed');
    this.setAttribute('aria-expanded', String(!isCollapsed));
    this.setAttribute('aria-label', isCollapsed ? 'Expand campus directory' : 'Collapse campus directory');
});
document.getElementById('clearRouteBtn').addEventListener('click', clearRouting);
document.getElementById('mapLocateBtn').addEventListener('click', function() {
    if (userPos && map) {
        map.flyTo([userPos.lat, userPos.lon], Math.max(map.getZoom(), 18), { duration: 0.7 });
        return;
    }
    requestCurrentLocation();
});
refreshBldsBtn.onclick = () => {
    if(usingFixed){ loadFixedBuildings(); infoBox.textContent = 'Refreshed fixed campus list.'; }
    else { if(userPos) fetchAndRenderBuildings(userPos.lat, userPos.lon); else alert('Wait for GPS.'); }
};
useFixedBtn.onclick = () => { loadFixedBuildings(); usingFixed = true; };
useOSMBtn.onclick = () => { if(!userPos) alert('Wait for location then press Load OSM.'); else loadOSMBuildings(); usingFixed = false; };

// Map type controls
mapTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const type = button.getAttribute('data-type');
        changeMapType(type);
    });
});

// wire fixed/osm buttons
useFixedBtn.onclick = () => { loadFixedBuildings(); usingFixed = true; };
useOSMBtn.onclick = async () => { if(!userPos){ alert('Allow location first'); return; } usingFixed = false; await fetchAndRenderBuildings(userPos.lat, userPos.lon); };

// hook refresh button
refreshBldsBtn.onclick = () => { if(usingFixed) loadFixedBuildings(); else if(userPos) fetchAndRenderBuildings(userPos.lat,userPos.lon); };

// cleanup
window.addEventListener('beforeunload', ()=>{
    if(watchId) navigator.geolocation.clearWatch(watchId);
    stopCamera();
    if (rotationAnimationId) cancelAnimationFrame(rotationAnimationId);
});

function stopCamera(){
    if(camStream){ camStream.getTracks().forEach(t=>t.stop()); camStream=null; camVideo.srcObject=null; }
    stopSimulatedCamera();
    if (arAnimationFrameId !== null) {
        cancelAnimationFrame(arAnimationFrameId);
        arAnimationFrameId = null;
    }
}

// Make viewBuildingModel function globally available
window.viewBuildingModel = viewBuildingModel;

// Initialize the app with authentication
initApp();