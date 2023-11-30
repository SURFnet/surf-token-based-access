# Use cases

## 1. SRC-RD: John, Mary and Pete collaborate.
### Requirements
* They each have a Research Drive account somewhere.
* John creates a VM on SURF Research Cloud.
* Mary somehow shares a folder from her Research Drive account
* Pete somehow is able to see Mary's folder mounted in the VM

### Implementation
* There is a CO in SRAM
* John, Mary and Pete are members
* John is allowed to create VMs on SURF Research Cloud, owned by the CO. This means all CO members get root ssh access to it.
* Since users tend to have root access on SRC VMs, we have only 1 set of mounts per VM, not 1 per VM OS user.
* When creating the VM, John can check a box to cause all current and future RD federated shares to the CO to get mounted.
* The shares get mounted with the maximum allowed permissions, so a read-only share gets mounted read-only, but a read-write
one gets mounted read-write.

I think there are no specific policies to administer:
Any VM can access any RD share, as long as it honestly lists the COs with access and doesn't allow others to ssh into the VM

RD decides if a given VM can access a given WebDAV folder, based on:
* can the VM prove that ONLY members of a given CO get ssh access to it
* this should be certified by SRC, the token should include an exhaustive list of which COs or individual SRAM users have ssh access to the VM
* SRAM is then the source of truth for both SRC and RD to discuss what these group IDs mean


Q1: It is assumed that anyone who is able to access these shares via the VM, would also already be allowed to access them in the same
access mode through their own RD account, so no exposure of data is added; we only make it less cumbersome to move data around.
How can we prove this assumption?

Q2: How should we deal with subshares? Maybe use the same paths at the destination as at the source.




## 2. Payment: John is buying a spectrometer from the university's internal webshop.
* The webshop is connected to SRAM. 
* The accounting software of John's research department is also connected to SRAM.
* John is somehow able to pay for the spectrometer through SRAM
* Money moves from the bank account of John's research department to the bank account of the university's internal webshop, and the spectrometer is delivered the next day.

## 3. Vlogging: John has recorded a video with his smartphone's camera app and now wants to publish this to the TikTok account of his university.
* The university's TikTok account is connected to SRAM
* John's smartphone is also connected to SRAM
* John is somehow able to select "publish to @Funiversity on TikTok" from some UI in the camera app on his smartphone
* The video is uploaded

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
