# Use cases
## 1. SRC-RD: John, Mary and Pete collaborate.
* They each have a Research Drive account somewhere.
* John creates a VM on SURF Research Cloud.
* Mary somehow shares a folder from her Research Drive account
* Pete somehow is able to see Mary's folder mounted in the VM

## 2. Payment: John is buying a spectrometer from the university's internal webshop.
* The webshop is connected to SRAM. 
* The accounting software of John's research department is also connected to SRAM.
* John is somehow able to pay for the spectrometer through SRAM
* Money moves from the bank account of John's research department to the bank account of the university's internal webshop, and the spectrometer is delivered the next day.

## 3. Vlogging: John has recorded a video with his smartphone's camera app and now wants to publish this to the TikTok account of his university.
• The university's TikTok account is connected to SRAM
• John's smartphone is also connected to SRAM
• John is somehow able to select "publish to @Funiversity on TikTok" from some UI in the camera app on his smartphone
• The video is uploaded

# Terminology
* SRC/shop/tiktok = client,
* SRAM=broker,
* RD/bank/camera = service

# Steps
1. The requesting party configures the client (SRC, shop, TikTok) to tell broker (SRAM, etc) that it can accept resources of the form X (webdav folder, payment, song) with conditions Y (from a CO member, via iDeal, in mp3 format). It goes through UMA claims gathering.

2. The broker puts the ask in the books, and advertises it to some of the connected services.

3. The service (RD, bank, camera) allows the resource owner to select resources to share with a client if the resource form matches X and the conditions Y are met.

4. The requesting party, through the client, has access to the resource.

5. The resource owner eventually clicks 'Revoke' in the service GUI and access is revoked.
