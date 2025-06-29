# SECTION PELANNING:

- Navigation
- Hero
- About
- skills
- projects
- contact
- CTA (send a message)
- Footer

## Navigation

-home
-about me
-projects
-content

## Hero

- Name: Alireza Eteghad
- Title: Electrical Engineer | FPGA | Embedded Systems | Signal Processing
- CTA Buttons: View Resume, Contact Me
- Hero image

## About

- Paragraphs from “Graduate researcher...” to “communication and mentorship.”

- Profile images

- Education section:

  - M.Sc. in Electrical Engineering – Integrated Circuits (2025)
  - B.Sc. in Electrical Engineering – Electronics (2023)

- Courses Taught

  - conference images

  - name of courses:
    - Digital Systems II
    - Microprocessor System Design
    - ASIC/FPGA Circuits

## Skills

- Programming: C, C++, VHDL
- Embedded Platforms: ARM, FPGAs
- OS: PetaLinux
- Driver Dev: A2D interfaces (AD7768, ISL26104)
- Signal Processing
- GUI Dev: Qt

## Projects

Each project as a card or collapsible section with (or a modale window):

- Title
- Description
- Bullet highlights
- 3 related images

Projects:

1. FSHA-DataLoggerGUI
   [title] Advanced Data Logger Interface
   [description] A custom Qt-based graphical user interface was developed for an embedded data logger system. This interface automatically detects connected USB ports and enables simultaneous, real-time data acquisition from multiple channels. Core functionalities include live signal plotting, real-time FFT analysis, linear transformations, interpolation, adjustable sampling rates, and seamless data export to Excel files. The application was implemented in C++/Qt with a codebase exceeding 12,000 lines, optimized for performance and responsiveness on embedded systems.

   - Auto USB Port Detection – Automatically detects and connects to the correct COM port.
   - Simultaneous Channel Reading – All sensors can be read and plotted in real time.
   - Live Plotting – Data is visualized instantly with smooth, multi-channel plots.
   - FFT Calculation – Real-time FFT computation for frequency domain analysis.
   - Excel Export – All collected data is saved to Excel format.
   - Function Fitting & Interpolation – Linear functions and point-based interpolation for calibration and transformation.
   - Sample Rate Control – User-defined sampling frequency (data per second).

2. ZYNQ Based Real-Time Data Logger
   [title] ZYNQ-Based Real-Time Data Logger
   [description] A high-speed, multi-channel data acquisition system designed using the ZYNQ XC7Z020 SoC and the 24-bit AD7768 ADC. This system features a sampling rate of 256 kSPS and real-time data transfer over Ethernet, making it ideal for industrial measurement, power monitoring, and medical applications. It captures and processes analog signals using ADA4807 precision amplifiers and a delta-sigma ADC. The architecture efficiently bridges programmable logic and ARM processors for concurrent data processing and transmission.

   - Powered by ZYNQ XC7Z020 SoC – Integrated ARM + FPGA system for high-speed processing.
   - 24-bit AD7768 ADC – Delta-sigma ADC with exceptional resolution and noise performance.
   - 256 kSPS Sampling Rate – Fast and accurate data acquisition for high-frequency signals.
   - Ethernet (TCP/IP) Communication – Real-time data transfer using lwIP stack.
   - Flexible Analog Front-End – ADA4807 amplifiers with configurable gain (×1 and ×10).
   - Direct PL-to-PS Data Transfer – AXI_GPIO-based communication without DMA overhead.
   - Software Integration – Qt and MATLAB-based interfaces for live display and configuration.
   - Multi-Signal Support – Tested with sine, square, triangle, and DC signals.
   - High Accuracy – Verified by comparing against precision voltmeter readings.

3. Smart Industrial Data Logger (In Progress)
   [title] 40-Channel Multi-Purpose Industrial Data Logger (In Progress)
   [description]A cutting-edge, multi-purpose industrial data logger is currently under development, designed to support real-time signal acquisition, intelligent processing, and flexible connectivity. The system features 64 configurable channels—40 analog and 24 digital—and is equipped with a next-generation Zynq Ultrascale+ MPSoC platform. It supports high-speed interfaces including WiFi6, Ethernet, and USB 3.0 for seamless integration with both desktop and mobile environments. The project also includes a powerful cross-platform Qt-based user interface for advanced visualization, processing, and export.

   - 64 Total Channels – Including 20 strain gauge inputs, 4 load cell channels, 8 LVDT, 8 high-speed analog (32-bit), 14 configurable digital I/Os, 6 accelerometer ports, and 2 temperature/humidity sensors.
   - Precision ADCs – Utilizes AD7768 (8-ch, 24-bit, 256kSPS) and AK5578EN (8-ch, 32-bit, 768kSPS) for high-resolution analog conversion.
   - High-Speed Interfaces – WiFi6, Gigabit Ethernet, and USB3.0 for fast, reliable data transmission across platforms.
   - Smart Qt-Based GUI – Real-time FFT, arithmetic operations, data logging, Excel/MATLAB export, and cross-platform compatibility (Windows/Android).
   - Onboard DisplayPort Output – Allows direct monitor connection to review and analyze live data.
   - Rugged Industrial Design – Built with industrial-grade components for operation between −40°C to +85°C.
   - Modular & Configurable – Customizable for sensor types, reference voltage outputs, and calibration settings.
   - Data Logging up to 1 Month – Capable of uninterrupted logging for extended durations with onboard storage and smart buffering.

## Contact + Resume

- icons of:
  email, LinkedIn, Research gate, google scolar, x.

- Downloadable PDF button (provide later and link it to the button on the hero section)

## CTA (send a message) + calendar

- a form for sending message
- line calendar for setting a 30-min meating.

## Footer

- copyright
- adress
- phone
- different sections
