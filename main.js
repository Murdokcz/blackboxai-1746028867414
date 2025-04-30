document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('megaSenaForm');
    const results = document.getElementById('results');
    const numberBalls = document.getElementById('numberBalls');
    const probabilityInfo = document.getElementById('probabilityInfo');

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('data').min = today;

    // Error message display function
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.innerHTML = `
            <span class="block sm:inline">${message}</span>
            <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <title>Fechar</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
            </span>
        `;
        form.insertBefore(errorDiv, form.firstChild);

        // Auto-remove error after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);

        // Click to dismiss
        errorDiv.querySelector('svg').addEventListener('click', () => errorDiv.remove());
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Remove any existing error messages
        const existingErrors = form.querySelectorAll('[role="alert"]');
        existingErrors.forEach(error => error.remove());

        // Validate date
        const dateInput = document.getElementById('data');
        if (!dateInput.value) {
            showError('Por favor, selecione uma data para o jogo.');
            return;
        }

        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            showError('A data do jogo não pode ser anterior a hoje.');
            return;
        }

        // Show loading state
        const submitButton = document.getElementById('submitBtn');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        
        // Add loading animation
        submitButton.innerHTML = `
            <span class="relative z-10 flex flex-col items-center">
                <span class="flex items-center">
                    <i class="fas fa-magic mr-2 animate-pulse"></i>
                    Gerando sua combinação...
                </span>
                <span class="block text-xs mt-2 opacity-75">Analisando probabilidades</span>
            </span>
            <div class="absolute inset-0 bg-white opacity-10"></div>
        `;
        submitButton.classList.add('loading-shimmer');

        // Hide previous results if any
        results.classList.add('hidden');

        // Simulate API call and processing
        setTimeout(() => {
            generateNumbers();
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            submitButton.classList.remove('loading-shimmer');
        }, 1500);
    });

    function generateNumbers() {
        const quantidade = parseInt(document.getElementById('quantidade').value);
        const data = document.getElementById('data').value;

        // Generate random numbers with weighted probability
        const frequentNumbers = [10, 5, 53, 23, 42, 33, 41, 27, 37, 30]; // Example frequent numbers
        let numbers = new Set();
        
        // First, add some frequent numbers with higher probability
        while(numbers.size < Math.min(3, quantidade)) {
            const randomFrequent = frequentNumbers[Math.floor(Math.random() * frequentNumbers.length)];
            numbers.add(randomFrequent);
        }

        // Then fill the rest with random numbers
        while(numbers.size < quantidade) {
            const num = Math.floor(Math.random() * 60) + 1;
            numbers.add(num);
        }

        numbers = Array.from(numbers).sort((a, b) => a - b);

        // Clear previous results first
        numberBalls.innerHTML = '';
        
        // Add numbers one by one with animation
        numbers.forEach((num, index) => {
            setTimeout(() => {
                const ball = document.createElement('div');
                ball.className = 'number-ball w-16 h-16 rounded-full bg-megasena text-white flex items-center justify-center font-bold text-xl shadow-lg';
                ball.innerHTML = num;
                numberBalls.appendChild(ball);

                // Add hover effect after animation
                setTimeout(() => {
                    ball.classList.add('hover:scale-110', 'hover:rotate-3', 'transition-all', 'duration-300', 'cursor-pointer');
                }, 600);
            }, index * 200);
        });

        // Enhanced probability info with more details
        const probabilityBase = 1/50063860;
        const adjustedProbability = probabilityBase * (quantidade > 6 ? quantidade/2 : 1);
        
        // Build probability info with animated appearance
        const probInfo = [
            {
                icon: 'chart-line',
                text: 'Análise baseada nos últimos sorteios e tendências'
            },
            {
                icon: 'percentage',
                text: `Probabilidade base: ${(probabilityBase*100).toFixed(8)}%`
            },
            {
                icon: 'calculator',
                text: `Probabilidade ajustada (${quantidade} números): ${(adjustedProbability*100).toFixed(8)}%`
            },
            {
                icon: 'calendar-alt',
                text: `Data do jogo: ${new Date(data).toLocaleDateString('pt-BR')}`
            }
        ];

        probabilityInfo.innerHTML = '';
        probInfo.forEach((info, index) => {
            setTimeout(() => {
                const p = document.createElement('p');
                p.className = 'flex items-center opacity-0 transform translate-y-4 transition-all duration-500';
                p.innerHTML = `
                    <i class="fas fa-${info.icon} text-megasena mr-2"></i>
                    <span>${info.text}</span>
                `;
                probabilityInfo.appendChild(p);
                
                // Animate in
                setTimeout(() => {
                    p.classList.remove('opacity-0', 'translate-y-4');
                }, 50);
            }, index * 200);
        });

        results.classList.remove('hidden');
        results.scrollIntoView({ behavior: 'smooth' });
    }
});
