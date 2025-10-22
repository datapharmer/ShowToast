import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ShowToast extends LightningElement {
    @api type = 'info';    // Toast type
    @api title = '';       // Toast title
    @api message = '';     // Toast message
    @api duration = 5;     // Duration in seconds
    @api mode = 'dismissable'; // Toast mode
    @api key = '';         // Toast key
    @api urlLink = '';     // URL for message link
    @api urlLabel = '';    // Label for URL link

    @api invoke() {
        try {
            let duration = (this.duration * 1000); // Convert to milliseconds
            
            // Validate duration (max 120 seconds)
            if (duration > 120000) {
                duration = 10000;
            }

            const isURL = this.message.toLowerCase().includes('{url}');
            
            if (!isURL) {
                this.showToast(
                    this.type.toLowerCase(),
                    this.title,
                    this.message,
                    duration,
                    this.mode.toLowerCase(),
                    this.key.toLowerCase()
                );
            } else {
                let messageUrl = this.message.replace('{url}', '{1}');
                let urlLink = this.urlLink;
                
                // Add 'http://' to URL if not present
                if (urlLink && urlLink.toLowerCase().indexOf('http') === -1) {
                    urlLink = 'http://' + urlLink;
                }
                
                this.showToastUrl(
                    this.type.toLowerCase(),
                    this.title,
                    messageUrl,
                    urlLink,
                    this.urlLabel || urlLink,
                    duration,
                    this.mode.toLowerCase(),
                    this.key.toLowerCase()
                );
            }
        } catch (error) {
            console.error('Error showing toast:', error);
            // Fallback toast in case of error
            this.showToast(
                'error',
                'Error',
                'Unable to display the toast message',
                5000,
                'dismissable',
                'error'
            );
        }
    }

    showToast(type, title, message, duration, mode, key) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: type,
            mode: mode,
            duration: duration,
            key: key
        });
        this.dispatchEvent(evt);
    }

    showToastUrl(type, title, messageUrl, urlLink, urlLabel, duration, mode, key) {
        const evt = new ShowToastEvent({
            title: title,
            message: messageUrl,
            messageData: [
                'Salesforce',
                {
                    url: urlLink,
                    label: urlLabel
                }
            ],
            variant: type,
            mode: mode,
            duration: duration,
            key: key
        });
        this.dispatchEvent(evt);
    }
}
