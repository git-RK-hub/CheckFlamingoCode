exports.signupTemplate = (link) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--[if IE]><html xmlns="http://www.w3.org/1999/xhtml" class="ie"><![endif]--><!--[if !IE]><!--><html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml"><!--<![endif]--><head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <title></title>
      <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge" /><!--<![endif]-->
      <meta name="viewport" content="width=device-width" /><style type="text/css">
  @media only screen and (min-width: 620px){.wrapper{min-width:600px !important}.wrapper h1{}.wrapper h1{font-size:56px !important;line-height:60px !important}.wrapper h2{}.wrapper h3{}.column{}.wrapper .size-8{font-size:8px !important;line-height:14px !important}.wrapper .size-9{font-size:9px !important;line-height:16px !important}.wrapper .size-10{font-size:10px !important;line-height:18px !important}.wrapper .size-11{font-size:11px !important;line-height:19px !important}.wrapper .size-12{font-size:12px !important;line-height:19px !important}.wrapper .size-13{font-size:13px !important;line-height:21px !important}.wrapper .size-14{font-size:14px !important;line-height:21px !important}.wrapper .size-15{font-size:15px !important;line-height:23px !important}.wrapper .size-16{font-size:16px !important;line-height:24px !important}.wrapper .size-17{font-size:17px !important;line-height:26px 
  !important}.wrapper .size-18{font-size:18px !important;line-height:26px !important}.wrapper .size-20{font-size:20px !important;line-height:28px !important}.wrapper .size-22{font-size:22px !important;line-height:31px !important}.wrapper .size-24{font-size:24px !important;line-height:32px !important}.wrapper .size-26{font-size:26px !important;line-height:34px !important}.wrapper .size-28{font-size:28px !important;line-height:36px !important}.wrapper .size-30{font-size:30px !important;line-height:38px !important}.wrapper .size-32{font-size:32px !important;line-height:40px !important}.wrapper .size-34{font-size:34px !important;line-height:43px !important}.wrapper .size-36{font-size:36px !important;line-height:43px !important}.wrapper .size-40{font-size:40px !important;line-height:47px !important}.wrapper .size-44{font-size:44px !important;line-height:50px !important}.wrapper 
  .size-48{font-size:48px !important;line-height:54px !important}.wrapper .size-56{font-size:56px !important;line-height:60px !important}.wrapper .size-64{font-size:64px !important;line-height:63px !important}}
  </style>
      <meta name="x-apple-disable-message-reformatting" />
      <style type="text/css">
  body {
    margin: 0;
    padding: 0;
  }
  table {
    border-collapse: collapse;
    table-layout: fixed;
  }
  * {
    line-height: inherit;
  }
  [x-apple-data-detectors] {
    color: inherit !important;
    text-decoration: none !important;
  }
  .wrapper .footer__share-button a:hover,
  .wrapper .footer__share-button a:focus {
    color: #ffffff !important;
  }
  .btn a:hover,
  .btn a:focus,
  .footer__share-button a:hover,
  .footer__share-button a:focus,
  .email-footer__links a:hover,
  .email-footer__links a:focus {
    opacity: 0.8;
  }
  .preheader,
  .header,
  .layout,
  .column {
    transition: width 0.25s ease-in-out, max-width 0.25s ease-in-out;
  }
  .preheader td {
    padding-bottom: 8px;
  }
  .layout,
  div.header {
    max-width: 400px !important;
    -fallback-width: 95% !important;
    width: calc(100% - 20px) !important;
  }
  div.preheader {
    max-width: 360px !important;
    -fallback-width: 90% !important;
    width: calc(100% - 60px) !important;
  }
  .snippet,
  .webversion {
    Float: none !important;
  }
  .stack .column {
    max-width: 400px !important;
    width: 100% !important;
  }
  .fixed-width.has-border {
    max-width: 402px !important;
  }
  .fixed-width.has-border .layout__inner {
    box-sizing: border-box;
  }
  .snippet,
  .webversion {
    width: 50% !important;
  }
  .ie .btn {
    width: 100%;
  }
  .ie .stack .column,
  .ie .stack .gutter {
    display: table-cell;
    float: none !important;
  }
  .ie div.preheader,
  .ie .email-footer {
    max-width: 560px !important;
    width: 560px !important;
  }
  .ie .snippet,
  .ie .webversion {
    width: 280px !important;
  }
  .ie div.header,
  .ie .layout {
    max-width: 600px !important;
    width: 600px !important;
  }
  .ie .two-col .column {
    max-width: 300px !important;
    width: 300px !important;
  }
  .ie .three-col .column,
  .ie .narrow {
    max-width: 200px !important;
    width: 200px !important;
  }
  .ie .wide {
    width: 400px !important;
  }
  .ie .stack.fixed-width.has-border,
  .ie .stack.has-gutter.has-border {
    max-width: 602px !important;
    width: 602px !important;
  }
  .ie .stack.two-col.has-gutter .column {
    max-width: 290px !important;
    width: 290px !important;
  }
  .ie .stack.three-col.has-gutter .column,
  .ie .stack.has-gutter .narrow {
    max-width: 188px !important;
    width: 188px !important;
  }
  .ie .stack.has-gutter .wide {
    max-width: 394px !important;
    width: 394px !important;
  }
  .ie .stack.two-col.has-gutter.has-border .column {
    max-width: 292px !important;
    width: 292px !important;
  }
  .ie .stack.three-col.has-gutter.has-border .column,
  .ie .stack.has-gutter.has-border .narrow {
    max-width: 190px !important;
    width: 190px !important;
  }
  .ie .stack.has-gutter.has-border .wide {
    max-width: 396px !important;
    width: 396px !important;
  }
  .ie .fixed-width .layout__inner {
    border-left: 0 none white !important;
    border-right: 0 none white !important;
  }
  .ie .layout__edges {
    display: none;
  }
  .mso .layout__edges {
    font-size: 0;
  }
  .layout-fixed-width,
  .mso .layout-full-width {
    background-color: #ffffff;
  }
  @media only screen and (min-width: 620px) {
    .column,
    .gutter {
      display: table-cell;
      Float: none !important;
      vertical-align: top;
    }
    div.preheader,
    .email-footer {
      max-width: 560px !important;
      width: 560px !important;
    }
    .snippet,
    .webversion {
      width: 280px !important;
    }
    div.header,
    .layout,
    .one-col .column {
      max-width: 600px !important;
      width: 600px !important;
    }
    .fixed-width.has-border,
    .fixed-width.x_has-border,
    .has-gutter.has-border,
    .has-gutter.x_has-border {
      max-width: 602px !important;
      width: 602px !important;
    }
    .two-col .column {
      max-width: 300px !important;
      width: 300px !important;
    }
    .three-col .column,
    .column.narrow,
    .column.x_narrow {
      max-width: 200px !important;
      width: 200px !important;
    }
    .column.wide,
    .column.x_wide {
      width: 400px !important;
    }
    .two-col.has-gutter .column,
    .two-col.x_has-gutter .column {
      max-width: 290px !important;
      width: 290px !important;
    }
    .three-col.has-gutter .column,
    .three-col.x_has-gutter .column,
    .has-gutter .narrow {
      max-width: 188px !important;
      width: 188px !important;
    }
    .has-gutter .wide {
      max-width: 394px !important;
      width: 394px !important;
    }
    .two-col.has-gutter.has-border .column,
    .two-col.x_has-gutter.x_has-border .column {
      max-width: 292px !important;
      width: 292px !important;
    }
    .three-col.has-gutter.has-border .column,
    .three-col.x_has-gutter.x_has-border .column,
    .has-gutter.has-border .narrow,
    .has-gutter.x_has-border .narrow {
      max-width: 190px !important;
      width: 190px !important;
    }
    .has-gutter.has-border .wide,
    .has-gutter.x_has-border .wide {
      max-width: 396px !important;
      width: 396px !important;
    }
  }
  @supports (display: flex) {
    @media only screen and (min-width: 620px) {
      .fixed-width.has-border .layout__inner {
        display: flex !important;
      }
    }
  }
  @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx) {
    .fblike {
      background-image: url(https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/fblike@2x.png) !important;
    }
    .tweet {
      background-image: url(https://i8.createsend1.com/static/eb/master/13-the-blueprint-3/images/tweet@2x.png) !important;
    }
    .linkedinshare {
      background-image: url(https://i9.createsend1.com/static/eb/master/13-the-blueprint-3/images/lishare@2x.png) !important;
    }
    .forwardtoafriend {
      background-image: url(https://i10.createsend1.com/static/eb/master/13-the-blueprint-3/images/forward@2x.png) !important;
    }
  }
  @media (max-width: 321px) {
    .fixed-width.has-border .layout__inner {
      border-width: 1px 0 !important;
    }
    .layout,
    .stack .column {
      min-width: 320px !important;
      width: 320px !important;
    }
    .border {
      display: none;
    }
    .has-gutter .border {
      display: table-cell;
    }
  }
  .mso div {
    border: 0 none white !important;
  }
  .mso .w560 .divider {
    Margin-left: 260px !important;
    Margin-right: 260px !important;
  }
  .mso .w360 .divider {
    Margin-left: 160px !important;
    Margin-right: 160px !important;
  }
  .mso .w260 .divider {
    Margin-left: 110px !important;
    Margin-right: 110px !important;
  }
  .mso .w160 .divider {
    Margin-left: 60px !important;
    Margin-right: 60px !important;
  }
  .mso .w354 .divider {
    Margin-left: 157px !important;
    Margin-right: 157px !important;
  }
  .mso .w250 .divider {
    Margin-left: 105px !important;
    Margin-right: 105px !important;
  }
  .mso .w148 .divider {
    Margin-left: 54px !important;
    Margin-right: 54px !important;
  }
  .mso .size-8,
  .ie .size-8 {
    font-size: 8px !important;
    line-height: 14px !important;
  }
  .mso .size-9,
  .ie .size-9 {
    font-size: 9px !important;
    line-height: 16px !important;
  }
  .mso .size-10,
  .ie .size-10 {
    font-size: 10px !important;
    line-height: 18px !important;
  }
  .mso .size-11,
  .ie .size-11 {
    font-size: 11px !important;
    line-height: 19px !important;
  }
  .mso .size-12,
  .ie .size-12 {
    font-size: 12px !important;
    line-height: 19px !important;
  }
  .mso .size-13,
  .ie .size-13 {
    font-size: 13px !important;
    line-height: 21px !important;
  }
  .mso .size-14,
  .ie .size-14 {
    font-size: 14px !important;
    line-height: 21px !important;
  }
  .mso .size-15,
  .ie .size-15 {
    font-size: 15px !important;
    line-height: 23px !important;
  }
  .mso .size-16,
  .ie .size-16 {
    font-size: 16px !important;
    line-height: 24px !important;
  }
  .mso .size-17,
  .ie .size-17 {
    font-size: 17px !important;
    line-height: 26px !important;
  }
  .mso .size-18,
  .ie .size-18 {
    font-size: 18px !important;
    line-height: 26px !important;
  }
  .mso .size-20,
  .ie .size-20 {
    font-size: 20px !important;
    line-height: 28px !important;
  }
  .mso .size-22,
  .ie .size-22 {
    font-size: 22px !important;
    line-height: 31px !important;
  }
  .mso .size-24,
  .ie .size-24 {
    font-size: 24px !important;
    line-height: 32px !important;
  }
  .mso .size-26,
  .ie .size-26 {
    font-size: 26px !important;
    line-height: 34px !important;
  }
  .mso .size-28,
  .ie .size-28 {
    font-size: 28px !important;
    line-height: 36px !important;
  }
  .mso .size-30,
  .ie .size-30 {
    font-size: 30px !important;
    line-height: 38px !important;
  }
  .mso .size-32,
  .ie .size-32 {
    font-size: 32px !important;
    line-height: 40px !important;
  }
  .mso .size-34,
  .ie .size-34 {
    font-size: 34px !important;
    line-height: 43px !important;
  }
  .mso .size-36,
  .ie .size-36 {
    font-size: 36px !important;
    line-height: 43px !important;
  }
  .mso .size-40,
  .ie .size-40 {
    font-size: 40px !important;
    line-height: 47px !important;
  }
  .mso .size-44,
  .ie .size-44 {
    font-size: 44px !important;
    line-height: 50px !important;
  }
  .mso .size-48,
  .ie .size-48 {
    font-size: 48px !important;
    line-height: 54px !important;
  }
  .mso .size-56,
  .ie .size-56 {
    font-size: 56px !important;
    line-height: 60px !important;
  }
  .mso .size-64,
  .ie .size-64 {
    font-size: 64px !important;
    line-height: 63px !important;
  }
  </style>
      
    <!--[if !mso]><!--><style type="text/css">
  @import url(https://fonts.googleapis.com/css?family=Oswald:400,700,400italic);
  </style><link href="https://fonts.googleapis.com/css?family=Oswald:400,700,400italic" rel="stylesheet" type="text/css" /><!--<![endif]--><style type="text/css">
  body{background-color:#ebebec}.logo a:hover,.logo a:focus{color:#1e2e3b !important}.mso .layout-has-border{border-top:1px solid #b7b7ba;border-bottom:1px solid #b7b7ba}.mso .layout-has-bottom-border{border-bottom:1px solid #b7b7ba}.mso .border,.ie .border{background-color:#b7b7ba}.mso h1,.ie h1{}.mso h1,.ie h1{font-size:56px !important;line-height:60px !important}.mso h2,.ie h2{}.mso h3,.ie h3{}.mso .layout__inner,.ie .layout__inner{}.mso .footer__share-button p{}.mso .footer__share-button p{font-family:Courier New,Courier,monospace}
  </style><meta name="robots" content="noindex,nofollow" />
  <meta property="og:title" content="My First Campaign" />
  </head>
  <!--[if mso]>
    <body class="mso">
  <![endif]-->
  <!--[if !mso]><!-->
    <body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;">
  <!--<![endif]-->
      <table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #ebebec;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td>
        <div role="banner">
          <div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);">
            <div style="border-collapse: collapse;display: table;width: 100%;">
            <!--[if (mso)|(IE)]><table align="center" class="preheader" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 280px" valign="top"><![endif]-->
              <div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #2b343f;font-family: Courier New,Courier,monospace;">
                
              </div>
            <!--[if (mso)|(IE)]></td><td style="width: 280px" valign="top"><![endif]-->
              <div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #2b343f;font-family: Courier New,Courier,monospace;">
                <p style="Margin-top: 0;Margin-bottom: 0;">No images? <webversion style="text-decoration: underline;">Click here</webversion></p>
              </div>
            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
            </div>
          </div>
          <div class="header" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);" id="emb-email-header-container">
          <!--[if (mso)|(IE)]><table align="center" class="header" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 600px"><![endif]-->
            <div class="logo emb-logo-margin-box" style="font-size: 26px;line-height: 32px;Margin-top: 6px;Margin-bottom: 20px;color: #41637e;font-family: Avenir,sans-serif;Margin-left: 20px;Margin-right: 20px;" align="center">
              <div class="logo-right" align="right" id="emb-email-header"><img style="display: block;height: auto;width: 100%;border: 0;max-width: 112px;" src="images/_logo.png" alt="" width="112" /></div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
        <div>
        <div style="background-color: #ebebec;">
          <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
            <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #ebebec;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
              <div class="column" style="text-align: left;color: #2b343f;font-size: 17px;line-height: 26px;font-family: Courier New,Courier,monospace;">
              
                <div style="Margin-left: 20px;Margin-right: 20px;">
        <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
          <h1 style="Margin-top: 0;Margin-bottom: 20px;font-style: normal;font-weight: normal;color: #363f49;font-size: 40px;line-height: 47px;font-family: Oswald,Avenir Next Condensed,Arial Narrow,MS UI Gothic,sans-serif;">Welcome Aboard!</h1>
        </div>
      </div>
              
                <div style="Margin-left: 20px;Margin-right: 20px;">
        <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
      </div>
              
              </div>
            <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
            </div>
          </div>
        </div>
    
        <div class="layout one-col fixed-width stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ff69b4;">
          <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-fixed-width" style="background-color: #ff69b4;"><td style="width: 600px" class="w560"><![endif]-->
            <div class="column" style="text-align: left;color: #2b343f;font-size: 17px;line-height: 26px;font-family: Courier New,Courier,monospace;">
          
              <div style="Margin-left: 20px;Margin-right: 20px;">
        <div style="mso-line-height-rule: exactly;line-height: 5px;font-size: 1px;">&nbsp;</div>
      </div>
          
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
    
        <div class="layout one-col fixed-width stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">
          <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-fixed-width" style="background-color: #ffffff;"><td style="width: 600px" class="w560"><![endif]-->
            <div class="column" style="text-align: left;color: #2b343f;font-size: 17px;line-height: 26px;font-family: Courier New,Courier,monospace;">
          
              <div style="Margin-left: 20px;Margin-right: 20px;">
        <div style="mso-line-height-rule: exactly;line-height: 43px;font-size: 1px;">&nbsp;</div>
      </div>
          
              <div style="Margin-left: 20px;Margin-right: 20px;">
        <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
          <p style="Margin-top: 0;Margin-bottom: 20px;">Having you contributing for shaping the young minds through our platform is really a great honour. Indeed, all of us here are very excited to work with you.</p>
        </div>
      </div>
          
          <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
            <img style="border: 0;display: block;height: auto;width: 100%;max-width: 296px;" alt="" width="296" src="images/undraw_happy_announcement_ac67-99079e0b6d028a3c.png" />
          </div>
        
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 20px;">
        <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
      </div>
          
              <div style="Margin-left: 20px;Margin-right: 20px;">
        <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
          <p style="Margin-top: 0;Margin-bottom: 20px;">Please sign up so we can start working right away!</p>
        </div>
      </div>
          
              <div style="Margin-left: 20px;Margin-right: 20px;">
        <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
      </div>
          
              <div style="Margin-left: 20px;Margin-right: 20px;">
        <div class="btn btn--flat btn--large" style="Margin-bottom: 20px;text-align: center;">
          <![if !mso]><a style="border-radius: 4px;display: inline-block;font-size: 14px;font-weight: bold;line-height: 24px;padding: 12px 24px;text-align: center;text-decoration: none !important;transition: opacity 0.1s ease-in;color: #ffffff !important;background-color: #ff69b4;font-family: Gill Sans, Gill Sans MT, Trebuchet MS, sans-serif;" href=${link}>Sign Up</a><![endif]>
        <!--[if mso]><p style="line-height:0;margin:0;">&nbsp;</p><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href=${link} style="width:96px" arcsize="9%" fillcolor="#FF69B4" stroke="f"><v:textbox style="mso-fit-shape-to-text:t" inset="0px,11px,0px,11px"><center style="font-size:14px;line-height:24px;color:#FFFFFF;font-family:Gill Sans,Gill Sans MT,Trebuchet MS,sans-serif;font-weight:bold;mso-line-height-rule:exactly;mso-text-raise:4px">Sign Up</center></v:textbox></v:roundrect><![endif]--></div>
      </div>
          
              <div style="Margin-left: 20px;Margin-right: 20px;">
        <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
      </div>
          
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
    
        <div style="background-color: #3d4853;background: 0px 0px/auto auto repeat url(https://i1.createsend1.com/ei/t/D0/5D3/7BE/010746/csfinal/pattern1.png) #3d4853;background-position: 0px 0px;background-image: url(https://i1.createsend1.com/ei/t/D0/5D3/7BE/010746/csfinal/pattern1.png);background-repeat: repeat;background-size: auto auto;">
          <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
            <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background: 0px 0px/auto auto repeat url(https://i1.createsend1.com/ei/t/D0/5D3/7BE/010746/csfinal/pattern1.png) #3d4853;background-position: 0px 0px;background-image: url(https://i1.createsend1.com/ei/t/D0/5D3/7BE/010746/csfinal/pattern1.png);background-repeat: repeat;background-size: auto auto;background-color: #3d4853;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
              <div class="column" style="text-align: left;color: #2b343f;font-size: 17px;line-height: 26px;font-family: Courier New,Courier,monospace;">
              
          <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
            <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-top" style="border: 0;display: block;height: auto;width: 100%;max-width: 900px;" alt="" width="600" src="images/pagecurl_031-9900000000079e3c.png" />
          </div>
        
                <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 20px;">
        <div style="mso-line-height-rule: exactly;line-height: 76px;font-size: 1px;">&nbsp;</div>
      </div>
              
                <div style="Margin-left: 20px;Margin-right: 20px;">
        <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
      </div>
              
              </div>
            <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
            </div>
          </div>
        </div>
    
        
        <div role="contentinfo">
          <div class="layout email-footer stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
            <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
            <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 400px;" valign="top" class="w360"><![endif]-->
              <div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #2b343f;font-family: Courier New,Courier,monospace;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
                <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                  <table class="email-footer__links" style="border-collapse: collapse;table-layout: fixed;" role="presentation" emb-web-links><tbody><tr role="navigation">
                  <td style="padding: 0;width: 26px;" emb-web-links><a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #2b343f;" href="https://www.facebook.com/Flamingo-112093110593640/?modal=admin_todo_tour"><img style="border: 0;" src="https://i2.createsend1.com/static/eb/master/13-the-blueprint-3/images/facebook.png" width="26" height="26" alt="Facebook" /></a></td><td style="padding: 0 0 0 3px;width: 26px;" emb-web-links><a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #2b343f;" href="https://twitter.com/FlyWithFlamingo"><img style="border: 0;" src="https://i3.createsend1.com/static/eb/master/13-the-blueprint-3/images/twitter.png" width="26" height="26" alt="Twitter" /></a></td><td style="padding: 0 0 0 3px;width: 26px;" emb-web-links><a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: 
  #2b343f;" href="https://www.youtube.com/channel/UCkFPtI3b8NYt9-AU-Talwgg"><img style="border: 0;" src="https://i4.createsend1.com/static/eb/master/13-the-blueprint-3/images/youtube.png" width="26" height="26" alt="YouTube" /></a></td><td style="padding: 0 0 0 3px;width: 26px;" emb-web-links><a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #2b343f;" href="https://www.linkedin.com/company/flamingo-courses/"><img style="border: 0;" src="https://i6.createsend1.com/static/eb/master/13-the-blueprint-3/images/linkedin.png" width="26" height="26" alt="LinkedIn" /></a></td>
                  </tr></tbody></table>
                  <div style="font-size: 12px;line-height: 19px;Margin-top: 20px;">
                    <div>Flamingo Courses<br />
  New Delhi<br />
  support@flamingocourses.com<br />
  Phone: 9582272809, 9620677068<br />
  [Mon - Fri, 9AM to 6PM IST]</div>
                  </div>
                  <div style="font-size: 12px;line-height: 19px;Margin-top: 18px;">
                    
                  </div>
                  <!--[if mso]>&nbsp;<![endif]-->
                </div>
              </div>
            <!--[if (mso)|(IE)]></td><td style="width: 200px;" valign="top" class="w160"><![endif]-->
              <div class="column narrow" style="text-align: left;font-size: 12px;line-height: 19px;color: #2b343f;font-family: Courier New,Courier,monospace;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
                <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                  
                </div>
              </div>
            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
            </div>
          </div>
          <div class="layout one-col email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
            <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
            <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 600px;" class="w560"><![endif]-->
              <div class="column" style="text-align: left;font-size: 12px;line-height: 19px;color: #2b343f;font-family: Courier New,Courier,monospace;">
                <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                  <div style="font-size: 12px;line-height: 19px;">
                    <unsubscribe style="text-decoration: underline;">Unsubscribe</unsubscribe>
                  </div>
                </div>
              </div>
            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
            </div>
          </div>
        </div>
        <div style="line-height:40px;font-size:40px;">&nbsp;</div>
      </div></td></tr></tbody></table>
    
  </body></html>
  `;
};