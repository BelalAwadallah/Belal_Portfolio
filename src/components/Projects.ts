export class ProjectsInteraction {
    private cards: NodeListOf<HTMLElement>;

    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.initTiltEffect();
    }

    private initTiltEffect() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const multiplier = 20;
                
                const xCalc = (x - rect.width / 2) / rect.width * multiplier;
                const yCalc = -(y - rect.height / 2) / rect.height * multiplier;

                card.style.transform = `perspective(1000px) rotateX(${yCalc}deg) rotateY(${xCalc}deg) scale3d(1.05, 1.05, 1.05)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }
}

export class ChatbotLogic {
    private input: HTMLInputElement;
    private sendBtn: HTMLButtonElement;
    private messagesContainer: HTMLElement;

    constructor() {
        this.input = document.getElementById('chat-input') as HTMLInputElement;
        this.sendBtn = document.getElementById('chat-send') as HTMLButtonElement;
        this.messagesContainer = document.getElementById('chat-messages') as HTMLElement;

        if(this.sendBtn && this.input) {
            this.sendBtn.addEventListener('click', this.handleSend.bind(this));
            this.input.addEventListener('keypress', (e) => {
                if(e.key === 'Enter') this.handleSend();
            });
        }
    }

    private handleSend() {
        const val = this.input.value.trim();
        if(!val) return;
        
        this.input.value = '';
        this.appendMessage(val, 'user');

        setTimeout(() => {
            let reply = "Belal is an excellent addition to any team!";
            if(val.toLowerCase().includes('experience')) reply = "He has strong experience in Angular, JS, and UI design.";
            if(val.toLowerCase().includes('contact')) reply = "You can reach him at belalawadallah891@gmail.com";
            if(val.toLowerCase().includes('freelance')) reply = "Yes, he is actively seeking freelance and startup opportunities.";
            this.appendMessage(reply, 'ai');
        }, 1000);
    }

    private appendMessage(text: string, sender: 'user' | 'ai') {
        const div = document.createElement('div');
        if(sender === 'user') {
            div.className = 'bg-electricBlue text-white rounded-2xl rounded-tr-sm p-3 inline-block max-w-[80%] text-sm self-end float-right clear-both mb-2';
        } else {
            div.className = 'bg-cardBg rounded-2xl rounded-tl-sm p-3 inline-block max-w-[80%] text-sm text-textPrimary clear-both mb-2 mt-2';
        }
        div.innerText = text;
        this.messagesContainer.appendChild(div);
        this.messagesContainer.parentElement!.scrollTop = this.messagesContainer.parentElement!.scrollHeight;
    }
}
