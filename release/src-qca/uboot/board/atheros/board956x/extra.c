/* 
 * Copyright (c) 2014 Qualcomm Atheros, Inc.
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 */

#include <common.h>
#include <command.h>
#include <asm/mipsregs.h>
#include <asm/addrspace.h>
#include <config.h>
#include <version.h>
#include <atheros.h>

#ifdef CONFIG_ATH_NAND_BR
#include <nand.h>
#endif

#if !defined(ASUS_PRODUCT)
#ifdef CONFIG_ATH_NAND_BR
void *
ath_get_nand_cal_data(void)
{
	extern unsigned long long ath_nand_get_cal_offset(const char *ba);

        ulong           off,size;
        int             ret;
        static u_char   nand_cal_data[256 * 1024];
        nand_info_t *nand;

         /*
          * caldata partition is of 128k
          *
          */
        nand = &nand_info[nand_curr_device];
        size = nand->erasesize;

        /*
         * Get the Offset of Caldata partition
         */
        off = ath_nand_get_cal_offset(getenv("bootargs"));
        if(off == ATH_CAL_OFF_INVAL) {
                printf("Invalid CAL offset \n");
                return 1;
        }

        /*
         * Get the values from flash, and program into the MAC address
         * registers
         */
        ret = nand_read(nand, (loff_t)off, &size, nand_cal_data);
        printf(" %d bytes %s: %s\n", size,
                        "read", ret ? "ERROR" : "OK");
        if(ret != 0 ) {
                return NULL;
        }

        return nand_cal_data;
}
#endif
#endif /* !ASUS_PRODUCT */

void ath_set_tuning_caps(void)
{
	typedef struct {
		u_int8_t	pad[0x28],
				params_for_tuning_caps[2],
				featureEnable;
	} __attribute__((__packed__)) ar9300_eeprom_t;

	ar9300_eeprom_t	*eep;
	uint32_t	val;

#if defined(ASUS_PRODUCT)
	int r;
	ar9300_eeprom_t eep_buf;

	eep = &eep_buf;
	if ((r = ra_factory_read((uchar*) eep, WLANCAL, sizeof(eep_buf)))) {
		printf("%s: read WLANCAL fail!!! (r = %d)\n", __func__, r);
		return;
	}
#else /* !ASUS_PRODUCT */
#ifdef CONFIG_ATH_NAND_BR
        eep = (ar9300_eeprom_t *)ath_get_nand_cal_data();
#else
        eep = (ar9300_eeprom_t *)WLANCAL;
#endif /* CONFIG_ATH_NAND_BR */
#endif /* ASUS_PRODUCT */
	val =	XTAL_TCXODET_SET(0x0) |
		XTAL_XTAL_CAPINDAC_SET(0x4b) |
		XTAL_XTAL_CAPOUTDAC_SET(0x4b) |
		XTAL_XTAL_DRVSTR_SET(0x0) |
		XTAL_XTAL_SHORTXIN_SET(0x0) |
		XTAL_XTAL_LOCALBIAS_SET(0x1) |
		XTAL_XTAL_PWDCLKD_SET(0x0) |
		XTAL_XTAL_BIAS2X_SET(0x0) |
		XTAL_XTAL_LBIAS2X_SET(0x0) |
		XTAL_XTAL_SELVREG_SET(0X0) |
		XTAL_XTAL_OSCON_SET(0x1) |
		XTAL_XTAL_PWDCLKIN_SET(0x0) |
		XTAL_LOCAL_XTAL_SET(0x0) |
		XTAL_PWD_SWREGCLK_SET(0x0) |
		XTAL_LOCAL_EXT_CLK_OUT_EN_SET(0X0) |
		XTAL_EXT_CLK_OUT_EN_SET(0X0) |
		XTAL_XTAL_SVREG_SET(0X0) |
		XTAL_RBK_UDSEL_SET(0X0) |
		XTAL_SPARE_SET(0x0);

	/* checking feature enable bit 6 and caldata is valid */
	if ((eep->featureEnable & 0x40) && (eep->pad[0x0] != 0xff)) {
		val &= ~(XTAL_XTAL_CAPINDAC_MASK | XTAL_XTAL_CAPOUTDAC_MASK);
		val |=	XTAL_XTAL_CAPINDAC_SET(eep->params_for_tuning_caps[0]) |
			XTAL_XTAL_CAPOUTDAC_SET(eep->params_for_tuning_caps[0]);
	}

	ath_reg_wr(XTAL_ADDRESS, val);
	ath_reg_wr(XTAL2_ADDRESS, XTAL2_DCA_BYPASS_SET(0x1) |
					XTAL2_FSM_START_L_SET(0x1));
	ath_reg_wr(XTAL3_ADDRESS, XTAL3_EVAL_LENGTH_SET(0x400) |
					XTAL3_HARMONIC_NUMBER_SET(0xa2));

#define __str(x)	# x
#define str(x)		__str(x)
#if defined(CONFIG_AP151)
    val = ath_reg_rd(GPIO_FUNCTION_ADDRESS);
	ath_reg_wr(GPIO_FUNCTION_ADDRESS, val | 0x2);
#endif
	printf("Setting " str(XTAL_ADDRESS) " to 0x%x\n", val);
	return;
}
