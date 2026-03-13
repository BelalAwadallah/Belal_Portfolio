export class ProjectsInteraction {
    private cards: NodeListOf<HTMLElement>;
    private modal: HTMLElement | null;
    private modalContent: HTMLElement | null;
    private closeBtn: HTMLElement | null;
    private overlay: HTMLElement | null;

    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.modal = document.getElementById('project-modal');
        this.modalContent = document.getElementById('modal-content');
        this.closeBtn = document.getElementById('modal-close-btn');
        this.overlay = document.getElementById('modal-close-overlay');
        
        this.initTiltEffect();
        this.initModalLogic();
    }

    private initModalLogic() {
        if (!this.modal || !this.modalContent) return;

        // Open Modal
        this.cards.forEach(card => {
            const btn = card.querySelector('.open-modal-btn');
            btn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openModal(card);
            });
            // Also open on card click (excluding external links)
            card.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                if (!target.closest('a') && !target.closest('button')) {
                    this.openModal(card);
                }
            });
        });

        // Close Modal
        this.closeBtn?.addEventListener('click', () => this.closeModal());
        this.overlay?.addEventListener('click', () => this.closeModal());
        
        // Escape key close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal?.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    private openModal(card: HTMLElement) {
        if (!this.modal || !this.modalContent) return;

        const data = {
            title: card.getAttribute('data-full-title'),
            desc: card.getAttribute('data-full-desc'),
            stack: card.getAttribute('data-stack'),
            github: card.getAttribute('data-github'),
            live: card.getAttribute('data-live'),
            img: card.querySelector('img')?.src
        };

        const mTitle = document.getElementById('modal-title');
        const mDesc = document.getElementById('modal-desc');
        const mStack = document.getElementById('modal-stack');
        const mGithub = document.getElementById('modal-github') as HTMLAnchorElement;
        const mLive = document.getElementById('modal-live') as HTMLAnchorElement;
        const mImage = document.getElementById('modal-image') as HTMLImageElement;

        if (mTitle) mTitle.innerText = data.title || "";
        if (mDesc) mDesc.innerText = data.desc || "";
        if (mImage && data.img) mImage.src = data.img;
        if (mGithub) mGithub.href = data.github || "#";
        if (mLive) mLive.href = data.live || "#";

        if (mStack && data.stack) {
            mStack.innerHTML = data.stack.split(',').map(s => `
                <span class="text-[10px] uppercase font-bold tracking-wider text-electricBlue bg-electricBlue/10 px-3 py-1 rounded-full border border-electricBlue/20">
                    ${s.trim()}
                </span>
            `).join('');
        }

        // Show modal with animation
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            this.modalContent?.classList.remove('translate-y-10', 'opacity-0');
            this.modalContent?.classList.add('translate-y-0', 'opacity-100');
        }, 10);
    }

    private closeModal() {
        this.modalContent?.classList.add('translate-y-10', 'opacity-0');
        this.modalContent?.classList.remove('translate-y-0', 'opacity-100');
        
        setTimeout(() => {
            this.modal?.classList.add('hidden');
            document.body.style.overflow = '';
        }, 500);
    }

    private initTiltEffect() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const multiplier = 10;
                
                const xCalc = (x - rect.width / 2) / rect.width * multiplier;
                const yCalc = -(y - rect.height / 2) / rect.height * multiplier;

                card.style.transform = `perspective(2000px) rotateX(${yCalc}deg) rotateY(${xCalc}deg) scale3d(1.02, 1.02, 1.02)`;
                
                // Parallax effect for image
                const img = card.querySelector('img');
                if (img) {
                    img.style.transform = `scale(1.1) translate(${-xCalc}px, ${-yCalc}px)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(2000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                const img = card.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1) translate(0, 0)';
                }
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
