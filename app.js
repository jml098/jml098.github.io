const { createApp, ref, onMounted, onUnmounted, computed } = Vue;

const app = createApp({
  setup() {
    // Game state
    const score = ref(0);
    const timeLeft = ref(60); // 60 seconds
    const isGameActive = ref(false);
    const isGameOver = ref(false);
    const isTargetHovered = ref(false);
    const isCountingDown = ref(false);
    const countdownValue = ref(3);

    // Target properties
    const targetSize = ref(50); // Initial size in pixels
    const targetX = ref(50);
    const targetY = ref(50);
    const targetMinSize = 20;
    const targetMaxSize = 80;

    const mouseX = ref(targetX.value);
    const mouseY = ref(targetY.value);

    // Game area dimensions
    const gameWidth = ref(window.innerWidth);
    const gameHeight = ref(window.innerHeight);

    // Animation frame ID for cleanup
    let animationFrameId = null;
    let lastTimestamp = 0;
    let scoreInterval = null;
    let gameTimer = null;

    // Computed styles for the target
    const targetStyle = computed(() => {
      return {
        width: `${targetSize.value}px`,
        height: `${targetSize.value}px`,
        left: `${targetX.value}px`,
        top: `${targetY.value}px`,
      };
    });
    
    // Computed styles for the mouse cursor debug element
    const mouseCursorStyle = computed(() => {
      return {
        left: `${mouseX.value}px`,
        top: `${mouseY.value}px`,
      };
    });

    // Target movement parameters
    const movementParams = {
      speedX: getRandomDirection() * 150, // Initial speed, will be adjusted based on size
      targetDirectionX: 0, // Target direction for smooth transitions (-1 to 1)
      currentDirectionX: getRandomDirection(), // Current direction (-1 or 1)
      directionChangeRate: 2.0, // How quickly direction changes (higher = faster, lower = smoother)
      sizeChangeSpeed: getRandomSizeSpeed(),
      sizeDirection: 1, // 1 for growing, -1 for shrinking
      nextDirectionChange: getRandomTime(500, 1500), // Timing for random direction changes
      initialAcceleration: true, // Flag to track initial acceleration phase
      accelerationProgress: 0, // Progress of initial acceleration (0 to 1)
      accelerationDuration: 1, // Duration of initial acceleration in seconds
    };

    // Helper functions
    function getRandomDirection() {
      return Math.random() > targetX.value / gameWidth.value ? 1 : -1;
    }

    function getRandomSizeSpeed() {
      return Math.random() * 20 + 10;
    }

    // Calculate speed based on target size
    function calculateSpeedFromSize(size) {
      // Map size from targetMinSize-targetMaxSize to a speed range
      // Bigger = faster, smaller = slower
      const sizeRange = targetMaxSize - targetMinSize;
      const normalizedSize = (size - targetMinSize) / sizeRange; // 0 to 1
      const minSpeed = 150; // Increased minimum speed
      const maxSpeed = 600; // Increased maximum speed
      const speedRange = maxSpeed - minSpeed;

      return minSpeed + normalizedSize * speedRange;
    }

    function getRandomTime(min, max) {
      return Math.random() * (max - min) + min;
    }

    function updateTargetPosition(deltaTime) {
      // Calculate current speed based on target size
      const baseSpeed = calculateSpeedFromSize(targetSize.value);

      // Smooth direction change logic (skip during initial acceleration)
      if (!movementParams.initialAcceleration) {
        movementParams.nextDirectionChange -= deltaTime * 1000;
        if (movementParams.nextDirectionChange <= 0) {
          // Set a new target direction
          movementParams.targetDirectionX = getRandomDirection();
          movementParams.nextDirectionChange = getRandomTime(250, 750); // Random timing for changes
        }
      }

      // Smoothly interpolate current direction toward target direction
      if (
        movementParams.currentDirectionX !== movementParams.targetDirectionX
      ) {
        const directionDelta = movementParams.directionChangeRate * deltaTime;

        if (
          movementParams.targetDirectionX > movementParams.currentDirectionX
        ) {
          movementParams.currentDirectionX = Math.min(
            movementParams.currentDirectionX + directionDelta,
            movementParams.targetDirectionX
          );
        } else {
          movementParams.currentDirectionX = Math.max(
            movementParams.currentDirectionX - directionDelta,
            movementParams.targetDirectionX
          );
        }
      }

      // Apply the current direction to the speed
      let adjustedSpeed = baseSpeed * movementParams.currentDirectionX;

      // Apply initial acceleration if needed
      if (movementParams.initialAcceleration) {
        movementParams.accelerationProgress +=
          deltaTime / movementParams.accelerationDuration;

        if (movementParams.accelerationProgress >= 1) {
          // Acceleration complete
          movementParams.initialAcceleration = false;
          movementParams.accelerationProgress = 1;
        }

        // Apply easing function for smooth acceleration (cubic easing)
        const easeProgress =
          movementParams.accelerationProgress *
          movementParams.accelerationProgress *
          (3.0 - 2.0 * movementParams.accelerationProgress);

        // Scale the speed based on acceleration progress
        adjustedSpeed = adjustedSpeed * easeProgress;
      }

      // Update position based on speed and time (X-axis only)
      targetX.value += adjustedSpeed * deltaTime;

      // Boundary checks for X - bounce off edges with smooth transition
      if (targetX.value < targetSize.value / 2) {
        targetX.value = targetSize.value / 2;
        // Reverse direction smoothly
        movementParams.targetDirectionX = Math.abs(
          movementParams.targetDirectionX
        );
        // Give it a small immediate push in the right direction
        movementParams.currentDirectionX = 0.3;
      } else if (targetX.value > gameWidth.value - targetSize.value / 2) {
        targetX.value = gameWidth.value - targetSize.value / 2;
        // Reverse direction smoothly
        movementParams.targetDirectionX = -Math.abs(
          movementParams.targetDirectionX
        );
        // Give it a small immediate push in the right direction
        movementParams.currentDirectionX = -0.3;
      }

      // Store the current speed
      movementParams.speedX = adjustedSpeed;
    }

    function updateTargetSize(deltaTime) {
      // Update size based on direction and speed
      targetSize.value +=
        movementParams.sizeChangeSpeed *
        movementParams.sizeDirection *
        deltaTime;

      // Check size boundaries
      if (targetSize.value <= targetMinSize) {
        targetSize.value = targetMinSize;
        movementParams.sizeDirection = 1;
      } else if (targetSize.value >= targetMaxSize) {
        targetSize.value = targetMaxSize;
        movementParams.sizeDirection = -1;
      }

      // Randomly change size direction occasionally
      if (Math.random() < 0.01) {
        movementParams.sizeDirection *= -1;
      }

      // Randomly change size speed occasionally
      if (Math.random() < 0.01) {
        movementParams.sizeChangeSpeed = getRandomSizeSpeed();
      }

      // Note: Speed is automatically adjusted in updateTargetPosition based on current size
    }

    function gameLoop(timestamp) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds
      lastTimestamp = timestamp;

      if (isGameActive.value) {
        updateTargetPosition(deltaTime);
        updateTargetSize(deltaTime);

        const distance = Math.sqrt(
          (mouseX.value - targetX.value) ** 2 +
            (mouseY.value - targetY.value) ** 2
        );

        // Check if mouse is over target (within radius)
        isTargetHovered.value = distance <= targetSize.value / 2;
        if (isTargetHovered.value) {
          score.value++;
        }

        animationFrameId = requestAnimationFrame(gameLoop);
      }
    }

    function startGame() {
      // Reset game state
      score.value = 0;
      timeLeft.value = 60;
      isGameActive.value = false; // Don't start the game immediately
      isGameOver.value = false;
      isTargetHovered.value = false;
      isCountingDown.value = true;
      countdownValue.value = 3;

      // Initialize target position - center X, center Y
      targetX.value = gameWidth.value / 2;
      targetY.value = gameHeight.value / 2; // Center on Y-axis

      // Initialize direction parameters
      const initialDirection = 1; // Start with a consistent rightward movement
      movementParams.currentDirectionX = initialDirection;
      movementParams.targetDirectionX = initialDirection;
      movementParams.nextDirectionChange = getRandomTime(500, 1500);

      // Reset acceleration parameters
      movementParams.initialAcceleration = true;
      movementParams.accelerationProgress = 0;

      // Start countdown
      const countdownInterval = setInterval(() => {
        countdownValue.value--;

        if (countdownValue.value <= 0) {
          clearInterval(countdownInterval);
          isCountingDown.value = false;
          startActualGame();
        }
      }, 1000);
    }

    function startActualGame() {
      // Now actually start the game
      isGameActive.value = true;

      // Start game loop
      lastTimestamp = 0;
      animationFrameId = requestAnimationFrame(gameLoop);

      // Start game timer
      gameTimer = setInterval(() => {
        timeLeft.value--;
        if (timeLeft.value <= 0) {
          endGame();
        }
      }, 1000);
    }

    function endGame() {
      isGameActive.value = false;
      isGameOver.value = true;

      // Clean up intervals and animation
      clearInterval(scoreInterval);
      clearInterval(gameTimer);
      cancelAnimationFrame(animationFrameId);
    }

    function handleMouseMove(event) {
      // Update mouse position immediately
      mouseX.value = event.clientX;
      mouseY.value = event.clientY;
    }

    function handleResize() {
      gameWidth.value = window.innerWidth;
      gameHeight.value = window.innerHeight;
    }

    // Lifecycle hooks
    onMounted(() => {
      window.addEventListener("resize", handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", handleResize);
      clearInterval(scoreInterval);
      clearInterval(gameTimer);
      cancelAnimationFrame(animationFrameId);
    });

    return {
      score,
      timeLeft,
      isGameActive,
      isGameOver,
      targetStyle,
      mouseCursorStyle,
      isTargetHovered,
      isCountingDown,
      countdownValue,
      startGame,
      handleMouseMove,
    };
  },
});

app.mount("#app");
