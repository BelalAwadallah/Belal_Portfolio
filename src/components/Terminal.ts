export class TerminalLogic {
    private inputElement: HTMLInputElement;
    private outputElement: HTMLElement;
    
    private commands: Record<string, string> = {
        'help': 'Available commands: about, skills, projects, contact, github, clear',
        'about': 'Belal Awadallah. Software Engineer specializing in Angular and modern web tech. Building fast, scalable UI/UX.',
        'skills': 'Angular, TypeScript, TailwindCSS, C#, .NET, Python, C++, Java',
        'projects': 'E-Commerce Platform, Weather Forecast App, Bookmark Manager. Scroll down to see interactive 3D cards.',
        'contact': 'Email: belalawadallah891@gmail.com | LinkedIn: /belal-awadallah-3213b1288',
        'github': 'Redirecting to GitHub... (https://github.com/BelalAwadallah)',
        'sudo hire belal': '<span class="text-neonCyan animate-pulse">ACCESS GRANTED. Sending confirmation... Excellent choice!</span>'
    };

    constructor() {
        this.inputElement = document.getElementById('terminal-input') as HTMLInputElement;
        this.outputElement = document.getElementById('terminal-output') as HTMLElement;

        if(this.inputElement && this.outputElement) {
            this.inputElement.addEventListener('keypress', this.handleInput.bind(this));
        }
    }

    private handleInput(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            const val = this.inputElement.value.trim().toLowerCase();
            this.inputElement.value = '';

            if(val === '') return;

            // Echo command
            this.appendOutput(`<span class="text-green-400">root@belal~$</span> ${val}`);

            if(val === 'clear') {
                this.outputElement.innerHTML = '';
            } else if (this.commands[val]) {
                this.appendOutput(this.commands[val]);
                if(val === 'github') {
                    setTimeout(() => window.open('https://github.com/BelalAwadallah', '_blank'), 1000);
                }
            } else {
                this.appendOutput(`bash: ${val}: command not found. Type 'help'.`);
            }
        }
    }

    private appendOutput(html: string) {
        const div = document.createElement('div');
        div.className = 'mb-2 text-textSecondary';
        div.innerHTML = html;
        this.outputElement.appendChild(div);
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }
}
